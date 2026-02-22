import { ConvexError, v } from "convex/values";

import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { workspaceQuery } from "./custom";
import {
  assertSiteAdmin,
  assertUserInWorkspace,
  assertUserIsCoach,
  assertWorkspaceAdmin,
  getEffectiveWorkspaceRole,
  isSiteAdmin,
  isWorkspaceAdmin,
  requireAuth,
} from "./permissions";

const templateStatusValidator = v.union(
  v.literal("todo"),
  v.literal("in_progress"),
  v.literal("completed"),
  v.literal("blocked"),
);

const templatePriorityValidator = v.union(
  v.literal("low"),
  v.literal("medium"),
  v.literal("high"),
);

const projectTemplateValidator = v.object({
  _id: v.id("projectTemplates"),
  _creationTime: v.number(),
  name: v.string(),
  description: v.optional(v.string()),
  createdBy: v.string(),
  isPublic: v.boolean(),
  workspaceId: v.union(v.id("workspaces"), v.null()),
});

const templateTaskValidator = v.object({
  _id: v.id("templateTasks"),
  _creationTime: v.number(),
  templateId: v.id("projectTemplates"),
  label: v.string(),
  description: v.optional(v.string()),
  status: templateStatusValidator,
  priority: templatePriorityValidator,
  position: v.object({
    x: v.number(),
    y: v.number(),
  }),
  dependencies: v.array(v.id("templateTasks")),
});

async function assertCanViewTemplate(
  ctx: QueryCtx | MutationCtx,
  userId: string,
  template: Doc<"projectTemplates">,
) {
  if (template.workspaceId !== null) {
    await assertUserInWorkspace(ctx, userId, template.workspaceId);
    return;
  }

  if (template.isPublic || template.createdBy === userId) {
    return;
  }

  if (await isSiteAdmin(ctx, userId)) {
    return;
  }

  throw new ConvexError("You do not have access to this template");
}

async function assertCanEditTemplate(
  ctx: QueryCtx | MutationCtx,
  userId: string,
  template: Doc<"projectTemplates">,
) {
  if (template.createdBy === userId) {
    return;
  }

  if (await isSiteAdmin(ctx, userId)) {
    return;
  }

  if (
    template.workspaceId !== null &&
    (await isWorkspaceAdmin(ctx, userId, template.workspaceId))
  ) {
    return;
  }

  throw new ConvexError("You cannot edit this template");
}

function defaultPosition(index: number): { x: number; y: number } {
  return {
    x: 120 + (index % 4) * 260,
    y: 120 + Math.floor(index / 4) * 180,
  };
}

export const list = query({
  args: {
    workspaceSlug: v.optional(v.string()),
  },
  returns: v.array(projectTemplateValidator),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    if (args.workspaceSlug !== undefined) {
      const workspaceSlug = args.workspaceSlug;
      const workspace = await ctx.db
        .query("workspaces")
        .withIndex("by_slug", (q) => q.eq("slug", workspaceSlug))
        .unique();

      if (!workspace || workspace.deletedAt) {
        throw new ConvexError("Workspace not found");
      }

      await assertUserInWorkspace(ctx, userId, workspace._id);

      const [globalTemplates, workspaceTemplates] = await Promise.all([
        ctx.db
          .query("projectTemplates")
          .withIndex("by_workspaceId_and_isPublic", (q) =>
            q.eq("workspaceId", null).eq("isPublic", true),
          )
          .collect(),
        ctx.db
          .query("projectTemplates")
          .withIndex("by_workspaceId_and_isPublic", (q) =>
            q.eq("workspaceId", workspace._id).eq("isPublic", true),
          )
          .collect(),
      ]);

      return [...globalTemplates, ...workspaceTemplates];
    }

    const memberships = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const workspaceTemplateGroups = await Promise.all(
      memberships.map((membership) =>
        ctx.db
          .query("projectTemplates")
          .withIndex("by_workspaceId_and_isPublic", (q) =>
            q.eq("workspaceId", membership.workspaceId).eq("isPublic", true),
          )
          .collect(),
      ),
    );

    const globalTemplates = await ctx.db
      .query("projectTemplates")
      .withIndex("by_workspaceId_and_isPublic", (q) =>
        q.eq("workspaceId", null).eq("isPublic", true),
      )
      .collect();

    return [...globalTemplates, ...workspaceTemplateGroups.flat()];
  },
});

export const listForWorkspace = workspaceQuery({
  args: {
    workspaceSlug: v.string(),
  },
  role: "member",
  returns: v.array(projectTemplateValidator),
  handler: async (ctx) => {
    return await ctx.db
      .query("projectTemplates")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", ctx.workspaceId))
      .collect();
  },
});

export const listGlobal = query({
  args: {},
  returns: v.array(projectTemplateValidator),
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    const userIsSiteAdmin = await isSiteAdmin(ctx, userId);

    if (userIsSiteAdmin) {
      return await ctx.db
        .query("projectTemplates")
        .withIndex("by_workspaceId", (q) => q.eq("workspaceId", null))
        .collect();
    }

    return await ctx.db
      .query("projectTemplates")
      .withIndex("by_workspaceId_and_isPublic", (q) =>
        q.eq("workspaceId", null).eq("isPublic", true),
      )
      .collect();
  },
});

export const get = query({
  args: {
    templateId: v.id("projectTemplates"),
  },
  returns: v.union(
    v.object({
      template: projectTemplateValidator,
      tasks: v.array(templateTaskValidator),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const template = await ctx.db.get(args.templateId);

    if (!template) {
      return null;
    }

    await assertCanViewTemplate(ctx, userId, template);

    const tasks = await ctx.db
      .query("templateTasks")
      .withIndex("by_templateId", (q) => q.eq("templateId", template._id))
      .collect();

    return {
      template,
      tasks,
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    isPublic: v.boolean(),
    workspaceSlug: v.optional(v.string()),
  },
  returns: v.id("projectTemplates"),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    let workspaceId: Id<"workspaces"> | null = null;
    if (args.workspaceSlug !== undefined) {
      const workspaceSlug = args.workspaceSlug;
      const workspace = await ctx.db
        .query("workspaces")
        .withIndex("by_slug", (q) => q.eq("slug", workspaceSlug))
        .unique();

      if (!workspace || workspace.deletedAt) {
        throw new ConvexError("Workspace not found");
      }

      await assertWorkspaceAdmin(ctx, userId, workspace._id);
      workspaceId = workspace._id;
    } else {
      await assertSiteAdmin(ctx, userId);
    }

    const newTemplate: {
      name: string;
      createdBy: string;
      isPublic: boolean;
      workspaceId: Id<"workspaces"> | null;
      description?: string;
    } = {
      name: args.name,
      createdBy: userId,
      isPublic: args.isPublic,
      workspaceId,
    };

    if (args.description !== undefined) {
      newTemplate.description = args.description;
    }

    return await ctx.db.insert("projectTemplates", newTemplate);
  },
});

export const update = mutation({
  args: {
    templateId: v.id("projectTemplates"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const template = await ctx.db.get(args.templateId);

    if (!template) {
      throw new ConvexError("Template not found");
    }

    await assertCanEditTemplate(ctx, userId, template);

    const updates: Partial<Doc<"projectTemplates">> = {};

    if (args.name !== undefined) {
      updates.name = args.name;
    }

    if (args.description !== undefined) {
      updates.description = args.description;
    }

    if (args.isPublic !== undefined) {
      updates.isPublic = args.isPublic;
    }

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(args.templateId, updates);
    }

    return null;
  },
});

export const remove = mutation({
  args: {
    templateId: v.id("projectTemplates"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const template = await ctx.db.get(args.templateId);

    if (!template) {
      throw new ConvexError("Template not found");
    }

    await assertCanEditTemplate(ctx, userId, template);

    const tasks = await ctx.db
      .query("templateTasks")
      .withIndex("by_templateId", (q) => q.eq("templateId", args.templateId))
      .collect();

    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }

    await ctx.db.delete(args.templateId);
    return null;
  },
});

export const duplicate = mutation({
  args: {
    templateId: v.id("projectTemplates"),
    workspaceSlug: v.string(),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
  },
  returns: v.id("projectTemplates"),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const sourceTemplate = await ctx.db.get(args.templateId);
    if (!sourceTemplate) {
      throw new ConvexError("Template not found");
    }

    await assertCanViewTemplate(ctx, userId, sourceTemplate);

    const targetWorkspace = await ctx.db
      .query("workspaces")
      .withIndex("by_slug", (q) => q.eq("slug", args.workspaceSlug))
      .unique();

    if (!targetWorkspace || targetWorkspace.deletedAt) {
      throw new ConvexError("Workspace not found");
    }

    await assertWorkspaceAdmin(ctx, userId, targetWorkspace._id);

    const duplicatedTemplate: {
      name: string;
      createdBy: string;
      isPublic: boolean;
      workspaceId: Id<"workspaces"> | null;
      description?: string;
    } = {
      name: args.name ?? `${sourceTemplate.name} (Copy)`,
      createdBy: userId,
      isPublic: args.isPublic ?? false,
      workspaceId: targetWorkspace._id,
    };

    const templateDescription = args.description ?? sourceTemplate.description;
    if (templateDescription !== undefined) {
      duplicatedTemplate.description = templateDescription;
    }

    const newTemplateId = await ctx.db.insert(
      "projectTemplates",
      duplicatedTemplate,
    );

    const sourceTasks = await ctx.db
      .query("templateTasks")
      .withIndex("by_templateId", (q) => q.eq("templateId", sourceTemplate._id))
      .collect();

    const taskIdMap: Record<
      Id<"templateTasks">,
      Id<"templateTasks">
    > = {} as Record<Id<"templateTasks">, Id<"templateTasks">>;

    for (const task of sourceTasks) {
      const duplicatedTask: {
        templateId: Id<"projectTemplates">;
        label: string;
        status: "todo" | "in_progress" | "completed" | "blocked";
        priority: "low" | "medium" | "high";
        position: { x: number; y: number };
        dependencies: Array<Id<"templateTasks">>;
        description?: string;
      } = {
        templateId: newTemplateId,
        label: task.label,
        status: task.status,
        priority: task.priority,
        position: task.position,
        dependencies: [],
      };

      if (task.description !== undefined) {
        duplicatedTask.description = task.description;
      }

      const newTaskId = await ctx.db.insert("templateTasks", duplicatedTask);

      taskIdMap[task._id] = newTaskId;
    }

    for (const task of sourceTasks) {
      const mappedDependencies = task.dependencies
        .map((dependencyId) => taskIdMap[dependencyId])
        .filter((dependencyId): dependencyId is Id<"templateTasks"> =>
          Boolean(dependencyId),
        );

      const mappedTaskId = taskIdMap[task._id];
      if (!mappedTaskId) {
        continue;
      }

      await ctx.db.patch(mappedTaskId, {
        dependencies: mappedDependencies,
      });
    }

    return newTemplateId;
  },
});

export const createFromProject = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.string(),
    description: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
  },
  returns: v.id("projectTemplates"),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const project = await ctx.db.get(args.projectId);

    if (!project) {
      throw new ConvexError("Project not found");
    }

    const workspaceId = project.workspaceId as Id<"workspaces">;
    const workspace = await ctx.db.get(workspaceId);

    if (!workspace || workspace.deletedAt) {
      throw new ConvexError("Workspace not found");
    }

    const workspaceRole = await getEffectiveWorkspaceRole(
      ctx,
      userId,
      workspaceId,
    );
    if (workspaceRole !== "admin" && workspaceRole !== "owner") {
      await assertUserIsCoach(ctx, userId, args.projectId);
    }

    const projectTemplate: {
      name: string;
      createdBy: string;
      isPublic: boolean;
      workspaceId: Id<"workspaces"> | null;
      description?: string;
    } = {
      name: args.name,
      createdBy: userId,
      isPublic: args.isPublic ?? true,
      workspaceId,
    };

    if (args.description !== undefined) {
      projectTemplate.description = args.description;
    }

    const templateId = await ctx.db.insert("projectTemplates", projectTemplate);

    const [projectTasks, taskNodes, projectEdges] = await Promise.all([
      ctx.db
        .query("tasks")
        .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
        .collect(),
      ctx.db
        .query("taskNodes")
        .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
        .collect(),
      ctx.db
        .query("edges")
        .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
        .collect(),
    ]);

    const nodeByTaskId: Record<Id<"tasks">, Doc<"taskNodes">> = {} as Record<
      Id<"tasks">,
      Doc<"taskNodes">
    >;
    for (const node of taskNodes) {
      nodeByTaskId[node.taskId] = node;
    }

    const dependencyMap: Record<Id<"tasks">, Array<Id<"tasks">>> = {} as Record<
      Id<"tasks">,
      Array<Id<"tasks">>
    >;

    for (const edge of projectEdges) {
      const current = dependencyMap[edge.target] ?? [];
      current.push(edge.source);
      dependencyMap[edge.target] = current;
    }

    const taskIdMap: Record<Id<"tasks">, Id<"templateTasks">> = {} as Record<
      Id<"tasks">,
      Id<"templateTasks">
    >;

    for (const [index, task] of projectTasks.entries()) {
      const node = nodeByTaskId[task._id];
      const templateTask: {
        templateId: Id<"projectTemplates">;
        label: string;
        status: "todo" | "in_progress" | "completed" | "blocked";
        priority: "low" | "medium" | "high";
        position: { x: number; y: number };
        dependencies: Array<Id<"templateTasks">>;
        description?: string;
      } = {
        templateId,
        label: task.label ?? "Untitled Task",
        status: task.status ?? "todo",
        priority: task.priority ?? "medium",
        position: node?.position ?? defaultPosition(index),
        dependencies: [],
      };

      if (task.description !== undefined) {
        templateTask.description = task.description;
      }

      const newTaskId = await ctx.db.insert("templateTasks", templateTask);

      taskIdMap[task._id] = newTaskId;
    }

    for (const task of projectTasks) {
      const dependencies = dependencyMap[task._id] ?? [];
      const mappedDependencies = dependencies
        .map((dependencyId) => taskIdMap[dependencyId])
        .filter((dependencyId): dependencyId is Id<"templateTasks"> =>
          Boolean(dependencyId),
        );

      const mappedTaskId = taskIdMap[task._id];
      if (!mappedTaskId) {
        continue;
      }

      await ctx.db.patch(mappedTaskId, {
        dependencies: mappedDependencies,
      });
    }

    return templateId;
  },
});
