import {
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import { ConvexError, v } from "convex/values";

import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import {
  assertSiteAdmin,
  assertUserInProject,
  assertUserInWorkspace,
  assertUserIsCoach,
  assertWorkspaceAdmin,
  assertWorkspaceOwner,
  getEffectiveWorkspaceRole,
  getWorkspaceRole,
  requireAuth,
  UserRole,
  WorkspaceRole,
} from "./permissions";

export const siteAdminQuery = customQuery(query, {
  args: {},
  input: async (ctx) => {
    const userId = await requireAuth(ctx);
    await assertSiteAdmin(ctx, userId);
    return {
      ctx: {
        isSiteAdmin: true,
        db: ctx.db,
        userId,
      },
      args: {},
    };
  },
});

export const siteAdminMutation = customMutation(mutation, {
  args: {},
  input: async (ctx) => {
    const userId = await requireAuth(ctx);
    await assertSiteAdmin(ctx, userId);
    return { ctx: { isSiteAdmin: true, db: ctx.db, userId }, args: {} };
  },
});

export const workspaceQuery = customQuery(query, {
  args: { workspaceSlug: v.string() },
  input: async (ctx, args, { role }: { role: WorkspaceRole }) => {
    const userId = await requireAuth(ctx);

    const workspace = await ctx.db
      .query("workspaces")
      .withIndex("by_slug", (q) => q.eq("slug", args.workspaceSlug))
      .unique();
    const workspaceId = workspace?._id;

    if (!workspaceId) {
      throw new Error("Workspace not found");
    }

    if (role === "member") {
      await assertUserInWorkspace(ctx, userId, workspaceId);
    } else if (role === "admin") {
      await assertWorkspaceAdmin(ctx, userId, workspaceId);
    } else {
      await assertWorkspaceOwner(ctx, userId, workspaceId);
    }

    return {
      ctx: { userId, workspaceId, workspace, db: ctx.db },
      args: args,
    };
  },
});

export const workspaceMutation = customMutation(mutation, {
  args: { workspaceSlug: v.string() },
  input: async (ctx, args, { role }: { role: WorkspaceRole }) => {
    const userId = await requireAuth(ctx);
    const workspace = await ctx.db
      .query("workspaces")
      .withIndex("by_slug", (q) => q.eq("slug", args.workspaceSlug))
      .unique();
    const workspaceId = workspace?._id;
    if (!workspaceId) {
      throw new ConvexError("Workspace not found");
    }

    if (role === "member") {
      await assertUserInWorkspace(ctx, userId, workspaceId);
    } else if (role === "admin") {
      await assertWorkspaceAdmin(ctx, userId, workspaceId);
    } else {
      await assertWorkspaceOwner(ctx, userId, workspaceId);
    }

    return {
      ctx: { userId, workspaceId, workspace, db: ctx.db },
      args: args,
    };
  },
});

export const projectQuery = customQuery(query, {
  args: { projectId: v.id("projects") },
  input: async (ctx, { projectId }, { role }: { role: UserRole }) => {
    const userId = await requireAuth(ctx);

    if (!userId) {
      throw new ConvexError("Unauthorized");
    }

    const project = await ctx.db.get(projectId);

    if (!project) {
      throw new ConvexError("Project not found");
    }

    const workspaceId = project.workspaceId;

    const workspaceRole = await getEffectiveWorkspaceRole(
      ctx,
      userId,
      workspaceId as Id<"workspaces">,
    );

    if (workspaceRole === "admin" || workspaceRole === "owner") {
      return {
        ctx: { userId, project, db: ctx.db },
        args: {},
      };
    }

    if (role === "member") {
      await assertUserInProject(ctx, userId, projectId);
    } else {
      await assertUserIsCoach(ctx, userId, projectId);
    }

    return {
      ctx: { userId, project, db: ctx.db },
      args: {},
    };
  },
});

export const projectMutation = customMutation(mutation, {
  args: { projectId: v.id("projects") },
  input: async (ctx, { projectId }, { role }: { role: UserRole }) => {
    const userId = await requireAuth(ctx);

    if (role === "member") {
      await assertUserInProject(ctx, userId, projectId);
    } else {
      await assertUserIsCoach(ctx, userId, projectId);
    }

    return {
      ctx: { userId, projectId, db: ctx.db },
      args: {},
    };
  },
});
