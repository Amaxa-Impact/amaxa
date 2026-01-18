import { v } from "convex/values";

import { query } from "./_generated/server";
import { isSiteAdmin } from "./permissions";

export const getCurrentUserStatus = query({
  args: {},
  returns: v.object({
    isAdmin: v.boolean(),
    userId: v.union(v.string(), v.null()),
  }),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log("getCurrentUserStatus identity", identity);

    if (!identity?.subject) {
      console.log("getCurrentUserStatus: not authenticated");
      return { isAdmin: false, userId: null };
    }

    const userId = identity.subject;
    console.log("getCurrentUserStatus: userId", userId);
    const isAdmin = await isSiteAdmin(ctx, userId);
    console.log("getCurrentUserStatus: isAdmin", isAdmin);

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
