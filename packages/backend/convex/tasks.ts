import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { assertUserInProject, requireAuth } from "./permissions";

const taskDataValidator = v.object({
  label: v.optional(v.string()),
  description: v.optional(v.string()),
  status: v.optional(
    v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("blocked"),
    ),
  ),
  assignedTo: v.optional(v.string()),
  dueDate: v.optional(v.number()),
  priority: v.optional(
    v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  ),
});

/**
 * Create a new task with its node data
 */
export const create = mutation({
  args: {
    projectId: v.id("projects"),
    type: v.string(),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
    data: v.object({
      label: v.optional(v.string()),
      description: v.optional(v.string()),
      status: v.optional(
        v.union(
          v.literal("todo"),
          v.literal("in_progress"),
          v.literal("completed"),
          v.literal("blocked"),
        ),
      ),
      assignedTo: v.optional(v.string()),
      dueDate: v.optional(v.number()),
      priority: v.optional(
        v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
      ),
    }),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
  },
  returns: v.id("tasks"),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    await assertUserInProject(ctx, userId, args.projectId);

    const type = args.type.trim() === "" ? "task" : args.type;
    const label = args.data.label ?? "New Task";

    const taskId = await ctx.db.insert("tasks", {
      projectId: args.projectId,
      label,
      description: args.data.description,
      status: args.data.status,
      assignedTo: args.data.assignedTo,
      dueDate: args.data.dueDate,
      priority: args.data.priority,
    });

    await ctx.db.insert("taskNodes", {
      taskId,
      projectId: args.projectId,
      type,
      position: args.position,
      width: args.width,
      height: args.height,
    });

    return taskId;
  },
});

/**
 * Get all tasks for a project with their node data (returns React Flow nodes format)
 */
export const listForProject = query({
  args: {
    projectId: v.id("projects"),
  },
  returns: v.array(
    v.object({
      id: v.string(),
      type: v.string(),
      position: v.object({
        x: v.number(),
        y: v.number(),
      }),
      data: taskDataValidator,
      width: v.optional(v.number()),
      height: v.optional(v.number()),
      style: v.optional(
        v.object({
          backgroundColor: v.optional(v.string()),
          borderColor: v.optional(v.string()),
          color: v.optional(v.string()),
        }),
      ),
    }),
  ),
  handler: async (ctx, args) => {
    const taskNodes = await ctx.db
      .query("taskNodes")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    const results = await Promise.all(
      taskNodes.map(async (node) => {
        const task = await ctx.db.get(node.taskId);
        if (!task) {
          return null;
        }

        return {
          id: task._id,
          type: node.type,
          position: node.position,
          data: {
            label: task.label,
            description: task.description,
            status: task.status,
            assignedTo: task.assignedTo,
            dueDate: task.dueDate,
            priority: task.priority,
          },
          width: node.width,
          height: node.height,
          style: node.style,
        };
      }),
    );

    return results.filter((r): r is NonNullable<typeof r> => r !== null);
  },
});

/**
 * Get a single task by ID
 */
export const get = query({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      return null;
    }

    const node = await ctx.db
      .query("taskNodes")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .unique();

    return {
      ...task,
      node,
    };
  },
});

/**
 * Update task position (for drag operations) - real-time
 */
export const updatePosition = mutation({
  args: {
    taskId: v.id("tasks"),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    await assertUserInProject(ctx, userId, task.projectId);

    const node = await ctx.db
      .query("taskNodes")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .unique();

    if (node) {
      await ctx.db.patch(node._id, {
        position: args.position,
      });
    }
    return null;
  },
});

/**
 * Update task data (label, description, status, etc.)
 */
export const updateData = mutation({
  args: {
    taskId: v.id("tasks"),
    data: v.object({
      label: v.optional(v.string()),
      description: v.optional(v.string()),
      status: v.optional(
        v.union(
          v.literal("todo"),
          v.literal("in_progress"),
          v.literal("completed"),
          v.literal("blocked"),
        ),
      ),
      assignedTo: v.optional(v.string()),
      dueDate: v.optional(v.number()),
      priority: v.optional(
        v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
      ),
    }),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    await assertUserInProject(ctx, userId, task.projectId);

    const updates: Record<string, unknown> = {};
    if (args.data.label !== undefined) {
      updates.label = args.data.label;
    }
    if (args.data.description !== undefined) {
      updates.description = args.data.description;
    }
    if (args.data.status !== undefined) {
      updates.status = args.data.status;
    }
    if (args.data.assignedTo !== undefined) {
      updates.assignedTo = args.data.assignedTo;
    }
    if (args.data.dueDate !== undefined) {
      updates.dueDate = args.data.dueDate;
    }
    if (args.data.priority !== undefined) {
      updates.priority = args.data.priority;
    }

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(args.taskId, updates);
    }
    return null;
  },
});

/**
 * Update task style
 */
export const updateStyle = mutation({
  args: {
    taskId: v.id("tasks"),
    style: v.object({
      backgroundColor: v.optional(v.string()),
      borderColor: v.optional(v.string()),
      color: v.optional(v.string()),
    }),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    await assertUserInProject(ctx, userId, task.projectId);

    const node = await ctx.db
      .query("taskNodes")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .unique();

    if (node) {
      await ctx.db.patch(node._id, {
        style: args.style,
      });
    }
    return null;
  },
});

/**
 * Delete a task and its node
 */
export const remove = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    await assertUserInProject(ctx, userId, task.projectId);

    const outgoingEdges = await ctx.db
      .query("edges")
      .withIndex("by_source", (q) => q.eq("source", args.taskId))
      .collect();

    const incomingEdges = await ctx.db
      .query("edges")
      .withIndex("by_target", (q) => q.eq("target", args.taskId))
      .collect();

    for (const edge of [...outgoingEdges, ...incomingEdges]) {
      await ctx.db.delete(edge._id);
    }

    const node = await ctx.db
      .query("taskNodes")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .unique();

    if (node) {
      await ctx.db.delete(node._id);
    }

    await ctx.db.delete(args.taskId);
    return null;
  },
});

/**
 * Batch update task positions (for better performance when dragging multiple nodes)
 */
export const batchUpdatePositions = mutation({
  args: {
    updates: v.array(
      v.object({
        taskId: v.id("tasks"),
        position: v.object({
          x: v.number(),
          y: v.number(),
        }),
      }),
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    for (const update of args.updates) {
      const task = await ctx.db.get(update.taskId);
      if (!task) {
        throw new Error(`Task ${update.taskId} not found`);
      }
      await assertUserInProject(ctx, userId, task.projectId);
    }

    for (const update of args.updates) {
      const node = await ctx.db
        .query("taskNodes")
        .withIndex("by_task", (q) => q.eq("taskId", update.taskId))
        .unique();

      if (node) {
        await ctx.db.patch(node._id, {
          position: update.position,
        });
      }
    }
    return null;
  },
});
