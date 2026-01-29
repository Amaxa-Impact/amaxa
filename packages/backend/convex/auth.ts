import { v } from "convex/values";

import { query } from "./_generated/server";
import { isSiteAdmin, requireAuth } from "./permissions";

export const getCurrentUserStatus = query({
  args: {},
  returns: v.object({
    isAdmin: v.boolean(),
    userId: v.union(v.string(), v.null()),
  }),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.subject) {
      return { isAdmin: false, userId: null };
    }

    const userId = identity.subject;
    const isAdmin = await isSiteAdmin(ctx, userId);

    return { isAdmin, userId };
  },
});

export const getCurrentUserId = query({
  args: {},
  returns: v.union(v.string(), v.null()),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return identity?.subject ?? null;
  },
});

export const getIsSiteAdmin = query({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    const isAdmin = await isSiteAdmin(ctx, userId);

    return isAdmin;
  },
});
