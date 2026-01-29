import { ConvexError, v } from "convex/values";

import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import {
  projectMutation,
  projectQuery,
  workspaceMutation,
  workspaceQuery,
} from "./custom";
import {
  assertUserInProject,
  assertUserIsCoach,
  getEffectiveWorkspaceRole,
  getUserRole,
  isSiteAdmin,
  requireAuth,
} from "./permissions";

/**
 * Create a new project
 */
export const create = workspaceMutation({
  args: {
    workspaceSlug: v.string(),
    name: v.string(),
    description: v.string(),
  },
  returns: v.id("projects"),
  role: "admin",
  handler: async (ctx, args) => {
    const { workspace, userId } = ctx;

    const projectId = await ctx.db.insert("projects", {
      name: args.name,
      description: args.description,
      workspaceId: workspace._id,
    });

    await ctx.db.insert("userToProject", {
      userId,
      projectId,
      workspaceId: workspace._id,
      role: "coach",
    });

    return projectId;
  },
});

/**
 * Get a project by ID
 */
export const get = projectQuery({
  args: {
    projectId: v.id("projects"),
  },
  role: "member",
  returns: v.union(
    v.object({
      _id: v.id("projects"),
      _creationTime: v.number(),
      name: v.string(),
      description: v.string(),
      workspaceId: v.string(),
    }),
    v.null(),
  ),
  handler: (ctx) => {
    return ctx.project;
  },
});

/**
 * List all projects for the currently authenticated user
 * TODO: workspaceId should be v.id("workspaces") after migration is complete
 */
export const listForUser = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("projects"),
      _creationTime: v.number(),
      name: v.string(),
      description: v.string(),
      role: v.union(v.literal("coach"), v.literal("member")),
      workspaceId: v.id("workspaces"),
    }),
  ),
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);

    const userToProjects = await ctx.db
      .query("userToProject")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    // Batch load all projects to avoid N+1 queries
    const projectIds = userToProjects.map((utp) => utp.projectId);
    const projects = await Promise.all(projectIds.map((id) => ctx.db.get(id)));

    // Create a map for O(1) lookup
    const projectMap = new Map(
      projects
        .filter((p): p is NonNullable<typeof p> => p !== null)
        .map((p) => [p._id.toString(), p]),
    );

    return userToProjects
      .map((utp) => {
        const project = projectMap.get(utp.projectId.toString());
        if (!project) return null;

        return {
          _id: project._id,
          _creationTime: project._creationTime,
          name: project.name,
          description: project.description,
          role: utp.role,
          workspaceId: utp.workspaceId,
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);
  },
});

/**
 * List projects for a workspace (requires workspace membership)
 */
export const listByWorkspace = workspaceQuery({
  args: {
    workspaceSlug: v.string(),
  },
  returns: v.array(
    v.object({
      _id: v.id("projects"),
      _creationTime: v.number(),
      name: v.string(),
      description: v.string(),
      workspaceId: v.string(),
    }),
  ),
  role: "member",
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", ctx.workspaceId))
      .collect();
  },
});

/**
 * Update a project (name and description)
 * Requires coach permissions
 */
export const update = projectMutation({
  args: {
    projectId: v.id("projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  returns: v.null(),
  role: "coach",
  handler: async (ctx, args) => {
    const { projectId, ...updates } = args;
    await ctx.db.patch(projectId, updates);
    return null;
  },
});

/**
 * Get user's role in a project. Site admins get "coach" role.
 */
export const getUserProjectRole = query({
  args: {
    projectId: v.id("projects"),
  },
  returns: v.union(v.literal("coach"), v.literal("member"), v.null()),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    if (await isSiteAdmin(ctx, userId)) {
      return "coach";
    }

    const role = await getUserRole(ctx, userId, args.projectId);
    return role;
  },
});

/**
 * Delete a project and all associated data
 */
export const remove = workspaceMutation({
  args: {
    projectId: v.id("projects"),
  },
  role: "admin",
  returns: v.null(),
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }

    const edges = await ctx.db
      .query("edges")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    for (const edge of edges) {
      await ctx.db.delete(edge._id);
    }

    const userAssignments = await ctx.db
      .query("userToProject")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();

    for (const assignment of userAssignments) {
      await ctx.db.delete(assignment._id);
    }

    await ctx.db.delete(args.projectId);
    return null;
  },
});

export const checkProjectAccess = query({
  args: {
    projectId: v.id("projects"),
    userId: v.string(),
    role: v.union(v.literal("member"), v.literal("coach")),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const session = await ctx.auth.getUserIdentity();

    if (!session?.accessToken) {
      throw new ConvexError("Unauthorized");
    }

    const project = await ctx.db.get(args.projectId);

    if (!project) {
      throw new ConvexError("Project not found");
    }

    const workspaceId = project.workspaceId;

    const workspaceRole = await getEffectiveWorkspaceRole(
      ctx,
      args.userId,
      workspaceId as Id<"workspaces">,
    );

    if (workspaceRole === "admin" || workspaceRole === "owner") {
      return true;
    }

    if (args.role === "member") {
      await assertUserInProject(ctx, args.userId, project._id);
    } else {
      await assertUserIsCoach(ctx, args.userId, project._id);
    }

    return true;
  },
});
