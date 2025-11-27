import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { requireAuth, assertUserInProject } from './permissions';

// Validator for task data
const taskDataValidator = v.object({
  label: v.string(),
  description: v.optional(v.string()),
  status: v.optional(
    v.union(
      v.literal('todo'),
      v.literal('in_progress'),
      v.literal('completed'),
      v.literal('blocked')
    )
  ),
  assignedTo: v.optional(v.string()),
  dueDate: v.optional(v.number()),
  priority: v.optional(
    v.union(v.literal('low'), v.literal('medium'), v.literal('high'))
  ),
});

/**
 * Create a new task (React Flow node)
 */
export const create = mutation({
  args: {
    projectId: v.id('projects'),
    type: v.string(),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
    data: taskDataValidator,
    width: v.optional(v.number()),
    height: v.optional(v.number()),
  },
  returns: v.id('tasks'),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    await assertUserInProject(ctx, userId, args.projectId);

    const type = args.type.trim() === '' ? 'default' : args.type;
    
    return await ctx.db.insert('tasks', {
      projectId: args.projectId,
      type,
      position: args.position,
      data: args.data,
      width: args.width,
      height: args.height,
    });
  },
});

/**
 * Get all tasks for a project (returns React Flow nodes format)
 */
export const listForProject = query({
  args: {
    projectId: v.id('projects'),
  },
  returns: v.array(
    v.object({
      id: v.string(), // React Flow expects 'id' not '_id'
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
        })
      ),
      selected: v.optional(v.boolean()),
      dragging: v.optional(v.boolean()),
    })
  ),
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query('tasks')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    // Transform to React Flow node format
    return tasks.map((task) => ({
      id: task._id,
      type: task.type,
      position: task.position,
      data: task.data,
      width: task.width,
      height: task.height,
      style: task.style,
      selected: task.selected,
      dragging: task.dragging,
    }));
  },
});

/**
 * Update task position (for drag operations)
 */
export const updatePosition = mutation({
  args: {
    taskId: v.id('tasks'),
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
      throw new Error('Task not found');
    }
    await assertUserInProject(ctx, userId, task.projectId);

    await ctx.db.patch(args.taskId, {
      position: args.position,
    });
    return null;
  },
});

/**
 * Update task data
 */
export const updateData = mutation({
  args: {
    taskId: v.id('tasks'),
    data: taskDataValidator,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    await assertUserInProject(ctx, userId, task.projectId);

    await ctx.db.patch(args.taskId, {
      data: args.data,
    });
    return null;
  },
});

/**
 * Update task style
 */
export const updateStyle = mutation({
  args: {
    taskId: v.id('tasks'),
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
      throw new Error('Task not found');
    }
    await assertUserInProject(ctx, userId, task.projectId);

    await ctx.db.patch(args.taskId, {
      style: args.style,
    });
    return null;
  },
});

/**
 * Delete a task
 */
export const remove = mutation({
  args: {
    taskId: v.id('tasks'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    await assertUserInProject(ctx, userId, task.projectId);

    // Delete edges connected to this task
    const outgoingEdges = await ctx.db
      .query('edges')
      .withIndex('by_source', (q) => q.eq('source', args.taskId))
      .collect();
    
    const incomingEdges = await ctx.db
      .query('edges')
      .withIndex('by_target', (q) => q.eq('target', args.taskId))
      .collect();
    
    for (const edge of [...outgoingEdges, ...incomingEdges]) {
      await ctx.db.delete(edge._id);
    }

    // Delete the task
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
        taskId: v.id('tasks'),
        position: v.object({
          x: v.number(),
          y: v.number(),
        }),
      })
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    
    // Verify all tasks belong to projects the user has access to
    for (const update of args.updates) {
      const task = await ctx.db.get(update.taskId);
      if (!task) {
        throw new Error(`Task ${update.taskId} not found`);
      }
      await assertUserInProject(ctx, userId, task.projectId);
    }

    // Update all positions
    for (const update of args.updates) {
      await ctx.db.patch(update.taskId, {
        position: update.position,
      });
    }
    return null;
  },
});

export const fixEmptyTypes = mutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const allTasks = await ctx.db.query('tasks').collect();
    let fixed = 0;
    
    for (const task of allTasks) {
      if (task.type.trim() === '') {
        await ctx.db.patch(task._id, { type: 'default' });
        fixed++;
      }
    }
    
    return fixed;
  },
});

