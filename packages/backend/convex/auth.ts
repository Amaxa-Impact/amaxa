import type { AuthFunctions } from "@convex-dev/workos-authkit";
import { AuthKit } from "@convex-dev/workos-authkit";
import type { ComponentApi as WorkOSAuthKitComponentApi } from "@convex-dev/workos-authkit/_generated/component.js";
import { v } from "convex/values";

import type { DataModel } from "./_generated/dataModel";
import { components, internal } from "./_generated/api";
import { query } from "./_generated/server";
import { isSiteAdmin, requireAuth } from "./permissions";
import { upsertUserRecord } from "./users";

const authFunctions: AuthFunctions = internal.auth;
const workOSAuthKitComponent = (
  components as typeof components & {
    workOSAuthKit: WorkOSAuthKitComponentApi;
  }
).workOSAuthKit;

export const authKit = new AuthKit<DataModel>(workOSAuthKitComponent, {
  authFunctions,
});

export const { authKitEvent } = authKit.events({
  "user.created": async (ctx, event) => {
    await upsertUserRecord(ctx, {
      authId: event.data.id,
      email: event.data.email,
      firstName: event.data.firstName ?? undefined,
      lastName: event.data.lastName ?? undefined,
      profilePictureUrl: event.data.profilePictureUrl ?? undefined,
    });
  },
  "user.updated": async (ctx, event) => {
    await upsertUserRecord(ctx, {
      authId: event.data.id,
      email: event.data.email,
      firstName: event.data.firstName ?? undefined,
      lastName: event.data.lastName ?? undefined,
      profilePictureUrl: event.data.profilePictureUrl ?? undefined,
    });
  },
  "user.deleted": async (ctx, event) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", event.data.id))
      .unique();

    if (!user) {
      return;
    }

    await ctx.db.delete(user._id);
  },
});

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
