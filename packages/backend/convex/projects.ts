import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { requireAuth, assertUserIsCoach } from './permissions';

/**
 * Create a new project
 */
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
  },
  returns: v.id('projects'),
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    const projectId = await ctx.db.insert('projects', {
      name: args.name,
      description: args.description,
    });

    if (!userId?.tokenIdentifier) {
      throw new Error('User not authenticated');
    }

    // Automatically assign creator as a coach
    await ctx.db.insert('userToProject', {
      userId: userId?.tokenIdentifier,
      projectId,
      role: 'coach',
    });

    return projectId;
  },
});

/**
 * Get a project by ID
 */
export const get = query({
  args: {
    projectId: v.id('projects'),
  },
  returns: v.union(
    v.object({
      _id: v.id('projects'),
      _creationTime: v.number(),
      name: v.string(),
      description: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.projectId);
  },
});

/**
 * List all projects for a user
 */
export const listForUser = query({
  args: {
    userId: v.string(),
  },
  returns: v.array(
    v.object({
      _id: v.id('projects'),
      _creationTime: v.number(),
      name: v.string(),
      description: v.string(),
      role: v.union(v.literal('coach'), v.literal('member')),
    })
  ),
  handler: async (ctx, args) => {
    const userProjects = await ctx.db
      .query('userToProject')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .collect();

    const projects = [];
    for (const userProject of userProjects) {
      const project = await ctx.db.get(userProject.projectId);
      if (project) {
        projects.push({
          ...project,
          role: userProject.role,
        });
      }
    }

    return projects;
  },
});

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('projects'),
      _creationTime: v.number(),
      name: v.string(),
      description: v.string(),
    })
  ),
  handler: async (ctx) => {
    return await ctx.db.query('projects').collect();
  },
});

/**
 * Update a project (name and description)
 * Requires coach permissions
 */
export const update = mutation({
  args: {
    projectId: v.id('projects'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const currentUserId = await requireAuth(ctx);
    await assertUserIsCoach(ctx, currentUserId, args.projectId);

    const { projectId, ...updates } = args;
    await ctx.db.patch(projectId, updates);
    return null;
  },
});

/**
 * Delete a project and all associated data
 */
export const remove = mutation({
  args: {
    projectId: v.id('projects'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Delete all tasks
    const tasks = await ctx.db
      .query('tasks')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
    
    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }

    // Delete all edges
    const edges = await ctx.db
      .query('edges')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
    
    for (const edge of edges) {
      await ctx.db.delete(edge._id);
    }

    // Delete all user assignments
    const userAssignments = await ctx.db
      .query('userToProject')
      .withIndex('by_projectId', (q) => q.eq('projectId', args.projectId))
      .collect();
    
    for (const assignment of userAssignments) {
      await ctx.db.delete(assignment._id);
    }

    // Delete the project
    await ctx.db.delete(args.projectId);
    return null;
  },
});

