import { mutation } from './_generated/server';
import { v } from 'convex/values';
import type { Id } from './_generated/dataModel';
import { requireAuth, assertUserInProject } from './permissions';

// Validator for task data (matching schema)
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

// Validator for node input (id is optional, will be generated if not provided)
const nodeInputValidator = v.object({
  id: v.optional(v.string()),
  type: v.string(),
  position: v.object({
    x: v.number(),
    y: v.number(),
  }),
  data: taskDataValidator,
  width: v.optional(v.number()),
  height: v.optional(v.number()),
});

// Validator for edge input
const edgeInputValidator = v.object({
  source: v.string(),
  target: v.string(),
  type: v.optional(v.string()),
  sourceHandle: v.optional(v.string()),
  targetHandle: v.optional(v.string()),
  label: v.optional(v.string()),
  animated: v.optional(v.boolean()),
});

/**
 * Replace the entire graph for a project (delete all existing nodes/edges, then insert new ones)
 * This is used for batch saving local changes.
 */
export const replaceProjectGraph = mutation({
  args: {
    projectId: v.id('projects'),
    nodes: v.array(nodeInputValidator),
    edges: v.array(edgeInputValidator),
  },
  returns: v.object({
    nodeIds: v.array(v.id('tasks')),
    edgeIds: v.array(v.id('edges')),
  }),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    await assertUserInProject(ctx, userId, args.projectId);

    // 1. Delete all existing edges for the project
    const existingEdges = await ctx.db
      .query('edges')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
    
    for (const edge of existingEdges) {
      await ctx.db.delete(edge._id);
    }

    // 2. Delete all existing tasks for the project
    const existingTasks = await ctx.db
      .query('tasks')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
    
    for (const task of existingTasks) {
      await ctx.db.delete(task._id);
    }

    // 3. Insert new nodes and build ID mapping (old frontend ID -> new Convex ID)
    const idMap: Record<string, Id<'tasks'>> = {};
    const nodeIds: Id<'tasks'>[] = [];

    for (const node of args.nodes) {
      const type = node.type.trim() === '' ? 'default' : node.type;
      const newId = await ctx.db.insert('tasks', {
        projectId: args.projectId,
        type,
        position: node.position,
        data: node.data,
        width: node.width,
        height: node.height,
      });
      nodeIds.push(newId);
      
      // Map old frontend ID to new Convex ID if provided
      if (node.id) {
        idMap[node.id] = newId;
      }
    }

    // 4. Insert new edges, mapping old IDs to new Convex IDs
    const edgeIds: Id<'edges'>[] = [];
    
    for (const edge of args.edges) {
      // Map frontend IDs to Convex IDs
      const sourceId = idMap[edge.source] || (edge.source as Id<'tasks'>);
      const targetId = idMap[edge.target] || (edge.target as Id<'tasks'>);

      const edgeId = await ctx.db.insert('edges', {
        projectId: args.projectId,
        source: sourceId,
        target: targetId,
        type: edge.type || 'default',
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        label: edge.label,
        animated: edge.animated,
      });
      edgeIds.push(edgeId);
    }

    return { nodeIds, edgeIds };
  },
});

