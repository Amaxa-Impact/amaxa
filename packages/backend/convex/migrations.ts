import { mutation } from './_generated/server';
import { v } from 'convex/values';

/**
 * Migration: Update all 'default' roles to 'member'
 * Run this once via the Convex dashboard after deploying the schema change
 */
export const migrateDefaultToMember = mutation({
  args: {},
  returns: v.object({
    updated: v.number(),
  }),
  handler: async (ctx) => {
    const allAssignments = await ctx.db.query('userToProject').collect();
    let updated = 0;

    for (const assignment of allAssignments) {
      await ctx.db.patch(assignment._id, {
        role: 'member',
      });
      updated++;
    }

    return { updated };
  },
});

