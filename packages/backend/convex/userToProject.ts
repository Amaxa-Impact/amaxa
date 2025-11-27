import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { requireAuth, assertUserIsCoach } from './permissions';

/**
 * Assign a user to a project with a role
 * Requires coach permissions
 */
export const assign = mutation({
  args: {
    userId: v.string(),
    projectId: v.id('projects'),
    role: v.union(v.literal('coach'), v.literal('member')),
  },
  returns: v.id('userToProject'),
  handler: async (ctx, args) => {
    const currentUserId = await requireAuth(ctx);
    await assertUserIsCoach(ctx, currentUserId, args.projectId);

    const existing = await ctx.db
      .query('userToProject')
      .withIndex('by_userId_and_projectId', (q) =>
        q.eq('userId', args.userId).eq('projectId', args.projectId)
      )
      .unique();

    if (existing) {
      throw new Error('User is already assigned to this project');
    }

    return await ctx.db.insert('userToProject', {
      userId: args.userId,
      projectId: args.projectId,
      role: args.role,
    });
  },
});

/**
 * Get all users assigned to a project
 */
export const listUsersForProject = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('userToProject')
      .withIndex('by_projectId', (q) => q.eq('projectId', args.projectId))
      .collect();
  },
});

/**
 * Get all coaches for a project
 */
export const listCoachesForProject = query({
  args: {
    projectId: v.id('projects'),
  },
  returns: v.array(
    v.object({
      _id: v.id('userToProject'),
      userId: v.string(),
      projectId: v.id('projects'),
      role: v.union(v.literal('coach'), v.literal('member')),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query('userToProject')
      .withIndex('by_projectId_and_role', (q) =>
        q.eq('projectId', args.projectId).eq('role', 'coach')
      )
      .collect();
  },
});

/**
 * Update user's role in a project
 * Requires coach permissions
 */
export const updateRole = mutation({
  args: {
    userId: v.string(),
    projectId: v.id('projects'),
    role: v.union(v.literal('coach'), v.literal('member')),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const currentUserId = await requireAuth(ctx);
    await assertUserIsCoach(ctx, currentUserId, args.projectId);

    const assignment = await ctx.db
      .query('userToProject')
      .withIndex('by_userId_and_projectId', (q) =>
        q.eq('userId', args.userId).eq('projectId', args.projectId)
      )
      .unique();

    if (!assignment) {
      throw new Error('User is not assigned to this project');
    }

    await ctx.db.patch(assignment._id, {
      role: args.role,
    });
    return null;
  },
});

/**
 * Remove a user from a project
 * Requires coach permissions
 */
export const remove = mutation({
  args: {
    userId: v.string(),
    projectId: v.id('projects'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const currentUserId = await requireAuth(ctx);
    await assertUserIsCoach(ctx, currentUserId, args.projectId);

    const assignment = await ctx.db
      .query('userToProject')
      .withIndex('by_userId_and_projectId', (q) =>
        q.eq('userId', args.userId).eq('projectId', args.projectId)
      )
      .unique();

    if (!assignment) {
      throw new Error('User is not assigned to this project');
    }

    await ctx.db.delete(assignment._id);
    return null;
  },
});

/**
 * Check if a user has access to a project
 */
export const hasAccess = query({
  args: {
    userId: v.string(),
    projectId: v.id('projects'),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const assignment = await ctx.db
      .query('userToProject')
      .withIndex('by_userId_and_projectId', (q) =>
        q.eq('userId', args.userId).eq('projectId', args.projectId)
      )
      .unique();

    return assignment !== null;
  },
});

/**
 * Check if a user is a coach for a project
 */
export const isCoach = query({
  args: {
    userId: v.string(),
    projectId: v.id('projects'),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const assignment = await ctx.db
      .query('userToProject')
      .withIndex('by_userId_and_projectId', (q) =>
        q.eq('userId', args.userId).eq('projectId', args.projectId)
      )
      .unique();

    return assignment !== null && assignment.role === 'coach';
  },
});

/**
 * Get the current user's role in a project
 * Returns null if the user is not in the project
 */
export const getUserRole = query({
  args: {
    projectId: v.id('projects'),
  },
  returns: v.union(v.literal('coach'), v.literal('member'), v.null()),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.tokenIdentifier) {
      return null;
    }

    const assignment = await ctx.db
      .query('userToProject')
      .withIndex('by_userId_and_projectId', (q) =>
        q.eq('userId', identity.tokenIdentifier).eq('projectId', args.projectId)
      )
      .unique();

    if (!assignment) {
      return null;
    }

    return assignment.role as 'coach' | 'member';
  },
});


export const getUserTokenIdentifier = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return identity?.tokenIdentifier ?? null;
  },
});