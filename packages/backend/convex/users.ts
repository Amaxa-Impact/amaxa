import { ConvexError, v } from "convex/values";

import type { Doc } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./permissions";

const userOptionValidator = v.object({
  id: v.string(),
  email: v.string(),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  profilePictureUrl: v.optional(v.string()),
});

type UserSyncInput = {
  authId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
};

function toUserOption(user: Doc<"users">) {
  return {
    id: user.authId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    profilePictureUrl: user.profilePictureUrl,
  };
}

export async function upsertUserRecord(
  ctx: Pick<MutationCtx, "db">,
  input: UserSyncInput,
) {
  const now = Date.now();
  const existing = await ctx.db
    .query("users")
    .withIndex("by_authId", (q) => q.eq("authId", input.authId))
    .unique();

  if (!existing) {
    return await ctx.db.insert("users", {
      authId: input.authId,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      profilePictureUrl: input.profilePictureUrl,
      createdAt: now,
      updatedAt: now,
    });
  }

  const updates: Partial<Doc<"users">> = {};

  if (existing.email !== input.email) {
    updates.email = input.email;
  }
  if ((existing.firstName ?? undefined) !== input.firstName) {
    updates.firstName = input.firstName;
  }
  if ((existing.lastName ?? undefined) !== input.lastName) {
    updates.lastName = input.lastName;
  }
  if ((existing.profilePictureUrl ?? undefined) !== input.profilePictureUrl) {
    updates.profilePictureUrl = input.profilePictureUrl;
  }

  if (Object.keys(updates).length === 0) {
    return existing._id;
  }

  updates.updatedAt = now;
  await ctx.db.patch(existing._id, updates);
  return existing._id;
}

export const upsertFromSession = mutation({
  args: {
    authId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    profilePictureUrl: v.optional(v.string()),
  },
  returns: userOptionValidator,
  handler: async (ctx, args) => {
    const currentUserId = await requireAuth(ctx);

    if (currentUserId !== args.authId) {
      throw new ConvexError("Cannot upsert a profile for another user");
    }

    const userId = await upsertUserRecord(ctx, args);
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new ConvexError("Failed to upsert user profile");
    }

    return toUserOption(user);
  },
});

export const getCurrent = query({
  args: {},
  returns: v.union(userOptionValidator, v.null()),
  handler: async (ctx) => {
    const authId = await requireAuth(ctx);

    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", authId))
      .unique();

    if (!user) {
      return null;
    }

    return toUserOption(user);
  },
});

export const getByAuthId = query({
  args: {
    authId: v.string(),
  },
  returns: v.union(userOptionValidator, v.null()),
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", args.authId))
      .unique();

    if (!user) {
      return null;
    }

    return toUserOption(user);
  },
});

export const listAll = query({
  args: {},
  returns: v.array(userOptionValidator),
  handler: async (ctx) => {
    await requireAuth(ctx);

    const users = await ctx.db.query("users").withIndex("by_email").collect();

    return users.map(toUserOption);
  },
});

export const listByAuthIds = query({
  args: {
    authIds: v.array(v.string()),
  },
  returns: v.array(userOptionValidator),
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const uniqueAuthIds = [...new Set(args.authIds)];
    const users = await Promise.all(
      uniqueAuthIds.map(async (authId) => {
        return await ctx.db
          .query("users")
          .withIndex("by_authId", (q) => q.eq("authId", authId))
          .unique();
      }),
    );

    return users
      .filter((user): user is Doc<"users"> => user !== null)
      .map(toUserOption);
  },
});
