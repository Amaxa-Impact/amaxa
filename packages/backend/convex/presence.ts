import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const PRESENCE_TIMEOUT = 10_000;

export const list = query({
  args: {
    room: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const entries = await ctx.db
      .query("presence")
      .withIndex("by_room", (q) => q.eq("room", args.room))
      .collect();

    return entries.map((entry) => ({
      created: entry.created,
      latestJoin: entry.latestJoin,
      user: entry.user,
      data: entry.data as Record<string, unknown>,
      present: now - entry.updated < PRESENCE_TIMEOUT,
    }));
  },
});

export const update = mutation({
  args: {
    room: v.string(),
    user: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const existing = await ctx.db
      .query("presence")
      .withIndex("by_room_and_user", (q) =>
        q.eq("room", args.room).eq("user", args.user)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        data: args.data,
        updated: now,
      });
    } else {
      await ctx.db.insert("presence", {
        room: args.room,
        user: args.user,
        data: args.data,
        created: now,
        latestJoin: now,
        updated: now,
      });
    }

    return null;
  },
});

export const heartbeat = mutation({
  args: {
    room: v.string(),
    user: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const existing = await ctx.db
      .query("presence")
      .withIndex("by_room_and_user", (q) =>
        q.eq("room", args.room).eq("user", args.user)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        updated: now,
        latestJoin: now,
      });
    }

    return null;
  },
});

export const cleanup = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const staleThreshold = PRESENCE_TIMEOUT * 6;

    const entries = await ctx.db.query("presence").collect();

    let deletedCount = 0;
    for (const entry of entries) {
      if (now - entry.updated > staleThreshold) {
        await ctx.db.delete(entry._id);
        deletedCount++;
      }
    }

    return { deletedCount };
  },
});
