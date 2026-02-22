import { ConvexError, v } from "convex/values";

import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import {
  assertUserInWorkspace,
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

function taskDependsOn(
  sourceTaskId: Id<"templateTasks">,
  targetTaskId: Id<"templateTasks">,
  taskMap: Record<Id<"templateTasks">, Doc<"templateTasks">>,
  visited: Set<Id<"templateTasks">>,
): boolean {
  if (sourceTaskId === targetTaskId) {
    return true;
  }

  if (visited.has(sourceTaskId)) {
    return false;
  }

  visited.add(sourceTaskId);

  const sourceTask = taskMap[sourceTaskId];
  if (!sourceTask) {
    return false;
  }

  return sourceTask.dependencies.some((dependencyId) =>
    taskDependsOn(dependencyId, targetTaskId, taskMap, visited),
  );
}

export const listForTemplate = query({
  args: {
    templateId: v.id("projectTemplates"),
  },
  returns: v.array(templateTaskValidator),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const template = await ctx.db.get(args.templateId);

    if (!template) {
      throw new ConvexError("Template not found");
    }

    await assertCanViewTemplate(ctx, userId, template);

    return await ctx.db
      .query("templateTasks")
      .withIndex("by_templateId", (q) => q.eq("templateId", args.templateId))
      .collect();
  },
});

export const create = mutation({
  args: {
    templateId: v.id("projectTemplates"),
    label: v.string(),
    description: v.optional(v.string()),
    status: v.optional(templateStatusValidator),
    priority: v.optional(templatePriorityValidator),
    position: v.optional(
      v.object({
        x: v.number(),
        y: v.number(),
      }),
    ),
  },
  returns: v.id("templateTasks"),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const template = await ctx.db.get(args.templateId);

    if (!template) {
      throw new ConvexError("Template not found");
    }

    await assertCanEditTemplate(ctx, userId, template);

    return await ctx.db.insert("templateTasks", {
      templateId: args.templateId,
      label: args.label,
      description: args.description,
      status: args.status ?? "todo",
      priority: args.priority ?? "medium",
      position: args.position ?? { x: 120, y: 120 },
      dependencies: [],
    });
  },
});

export const update = mutation({
  args: {
    templateTaskId: v.id("templateTasks"),
    label: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(templateStatusValidator),
    priority: v.optional(templatePriorityValidator),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const task = await ctx.db.get(args.templateTaskId);

    if (!task) {
      throw new ConvexError("Template task not found");
    }

    const template = await ctx.db.get(task.templateId);
    if (!template) {
      throw new ConvexError("Template not found");
    }

    await assertCanEditTemplate(ctx, userId, template);

    const updates: Partial<Doc<"templateTasks">> = {};

    if (args.label !== undefined) {
      updates.label = args.label;
    }

    if (args.description !== undefined) {
      updates.description = args.description;
    }

    if (args.status !== undefined) {
      updates.status = args.status;
    }

    if (args.priority !== undefined) {
      updates.priority = args.priority;
    }

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(args.templateTaskId, updates);
    }

    return null;
  },
});

export const updatePosition = mutation({
  args: {
    templateTaskId: v.id("templateTasks"),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const task = await ctx.db.get(args.templateTaskId);

    if (!task) {
      throw new ConvexError("Template task not found");
    }

    const template = await ctx.db.get(task.templateId);
    if (!template) {
      throw new ConvexError("Template not found");
    }

    await assertCanEditTemplate(ctx, userId, template);

    await ctx.db.patch(args.templateTaskId, {
      position: args.position,
    });

    return null;
  },
});

export const batchUpdatePositions = mutation({
  args: {
    updates: v.array(
      v.object({
        templateTaskId: v.id("templateTasks"),
        position: v.object({
          x: v.number(),
          y: v.number(),
        }),
      }),
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    if (args.updates.length === 0) {
      return null;
    }

    const userId = await requireAuth(ctx);

    const tasks = await Promise.all(
      args.updates.map((update) => ctx.db.get(update.templateTaskId)),
    );

    const validTasks = tasks.filter(
      (task): task is NonNullable<typeof task> => task !== null,
    );

    if (validTasks.length !== args.updates.length) {
      throw new ConvexError("One or more template tasks were not found");
    }

    const firstTask = validTasks[0];
    if (!firstTask) {
      throw new ConvexError("One or more template tasks were not found");
    }

    const templateId = firstTask.templateId;
    const allSameTemplate = validTasks.every(
      (task) => task.templateId === templateId,
    );
    if (!allSameTemplate) {
      throw new ConvexError(
        "All template tasks must belong to the same template",
      );
    }

    const template = await ctx.db.get(templateId);
    if (!template) {
      throw new ConvexError("Template not found");
    }

    await assertCanEditTemplate(ctx, userId, template);

    for (const update of args.updates) {
      await ctx.db.patch(update.templateTaskId, {
        position: update.position,
      });
    }

    return null;
  },
});

export const remove = mutation({
  args: {
    templateTaskId: v.id("templateTasks"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const task = await ctx.db.get(args.templateTaskId);

    if (!task) {
      throw new ConvexError("Template task not found");
    }

    const template = await ctx.db.get(task.templateId);
    if (!template) {
      throw new ConvexError("Template not found");
    }

    await assertCanEditTemplate(ctx, userId, template);

    const templateTasks = await ctx.db
      .query("templateTasks")
      .withIndex("by_templateId", (q) => q.eq("templateId", task.templateId))
      .collect();

    for (const templateTask of templateTasks) {
      if (templateTask._id === args.templateTaskId) {
        continue;
      }

      const nextDependencies = templateTask.dependencies.filter(
        (dependencyId) => dependencyId !== args.templateTaskId,
      );

      if (nextDependencies.length !== templateTask.dependencies.length) {
        await ctx.db.patch(templateTask._id, {
          dependencies: nextDependencies,
        });
      }
    }

    await ctx.db.delete(args.templateTaskId);
    return null;
  },
});

export const addDependency = mutation({
  args: {
    sourceTaskId: v.id("templateTasks"),
    targetTaskId: v.id("templateTasks"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    if (args.sourceTaskId === args.targetTaskId) {
      throw new ConvexError("A task cannot depend on itself");
    }

    const userId = await requireAuth(ctx);
    const [sourceTask, targetTask] = await Promise.all([
      ctx.db.get(args.sourceTaskId),
      ctx.db.get(args.targetTaskId),
    ]);

    if (!sourceTask || !targetTask) {
      throw new ConvexError("Template task not found");
    }

    if (sourceTask.templateId !== targetTask.templateId) {
      throw new ConvexError("Both tasks must belong to the same template");
    }

    const template = await ctx.db.get(sourceTask.templateId);
    if (!template) {
      throw new ConvexError("Template not found");
    }

    await assertCanEditTemplate(ctx, userId, template);

    if (targetTask.dependencies.includes(sourceTask._id)) {
      return null;
    }

    const templateTasks = await ctx.db
      .query("templateTasks")
      .withIndex("by_templateId", (q) =>
        q.eq("templateId", sourceTask.templateId),
      )
      .collect();

    const taskMap: Record<
      Id<"templateTasks">,
      Doc<"templateTasks">
    > = {} as Record<Id<"templateTasks">, Doc<"templateTasks">>;
    for (const task of templateTasks) {
      taskMap[task._id] = task;
    }

    const introducesCycle = taskDependsOn(
      sourceTask._id,
      targetTask._id,
      taskMap,
      new Set<Id<"templateTasks">>(),
    );

    if (introducesCycle) {
      throw new ConvexError("This dependency would create a cycle");
    }

    await ctx.db.patch(targetTask._id, {
      dependencies: [...targetTask.dependencies, sourceTask._id],
    });

    return null;
  },
});

export const removeDependency = mutation({
  args: {
    sourceTaskId: v.id("templateTasks"),
    targetTaskId: v.id("templateTasks"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const [sourceTask, targetTask] = await Promise.all([
      ctx.db.get(args.sourceTaskId),
      ctx.db.get(args.targetTaskId),
    ]);

    if (!sourceTask || !targetTask) {
      throw new ConvexError("Template task not found");
    }

    if (sourceTask.templateId !== targetTask.templateId) {
      throw new ConvexError("Both tasks must belong to the same template");
    }

    const template = await ctx.db.get(sourceTask.templateId);
    if (!template) {
      throw new ConvexError("Template not found");
    }

    await assertCanEditTemplate(ctx, userId, template);

    await ctx.db.patch(targetTask._id, {
      dependencies: targetTask.dependencies.filter(
        (dependencyId) => dependencyId !== sourceTask._id,
      ),
    });

    return null;
  },
});
