import { v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import { mutation, query  } from "./_generated/server";
import type {QueryCtx} from "./_generated/server";
import { isSiteAdmin, requireAuth } from "./permissions";

export type WorkspaceRole = "owner" | "admin" | "member";

const ROLE_HIERARCHY: Record<WorkspaceRole, number> = {
  owner: 3,
  admin: 2,
  member: 1,
};

async function getWorkspaceRole(
  ctx: QueryCtx,
  userId: string,
  workspaceId: Id<"workspaces">
): Promise<WorkspaceRole | null> {
  const membership = await ctx.db
    .query("workspaceToUser")
    .withIndex("by_userId_and_workspaceId", (q) =>
      q.eq("userId", userId).eq("workspaceId", workspaceId)
    )
    .unique();

  return membership?.role ?? null;
}

export const addUser = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  returns: v.id("workspaceToUser"),
  handler: async (ctx, args) => {
    const currentUserId = await requireAuth(ctx);

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace || workspace.deletedAt) {
      throw new Error("Workspace not found");
    }

    const isAdmin = await isSiteAdmin(ctx, currentUserId);
    if (!isAdmin) {
      const currentRole = await getWorkspaceRole(ctx, currentUserId, args.workspaceId);
      if (!currentRole || ROLE_HIERARCHY[currentRole] < ROLE_HIERARCHY.admin) {
        throw new Error("You must be a workspace admin to add users");
      }
    }

    const existing = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId_and_workspaceId", (q) =>
        q.eq("userId", args.userId).eq("workspaceId", args.workspaceId)
      )
      .unique();

    if (existing) {
      throw new Error("User is already a member of this workspace");
    }

    return await ctx.db.insert("workspaceToUser", {
      workspaceId: args.workspaceId,
      userId: args.userId,
      role: args.role,
    });
  },
});

export const removeUser = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    userId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const currentUserId = await requireAuth(ctx);

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace || workspace.deletedAt) {
      throw new Error("Workspace not found");
    }

    const membership = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId_and_workspaceId", (q) =>
        q.eq("userId", args.userId).eq("workspaceId", args.workspaceId)
      )
      .unique();

    if (!membership) {
      throw new Error("User is not a member of this workspace");
    }

    const isAdmin = await isSiteAdmin(ctx, currentUserId);
    if (!isAdmin) {
      const currentRole = await getWorkspaceRole(ctx, currentUserId, args.workspaceId);
      if (!currentRole || ROLE_HIERARCHY[currentRole] < ROLE_HIERARCHY.admin) {
        throw new Error("You must be a workspace admin to remove users");
      }

      if (membership.role === "owner") {
        throw new Error("Cannot remove workspace owner. Transfer ownership first.");
      }
    }

    if (membership.role === "owner") {
      const owners = await ctx.db
        .query("workspaceToUser")
        .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
        .collect();

      const ownerCount = owners.filter((m) => m.role === "owner").length;
      if (ownerCount <= 1) {
        throw new Error("Cannot remove the last owner. Transfer ownership first.");
      }
    }

    await ctx.db.delete(membership._id);
    return null;
  },
});

export const updateRole = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    userId: v.string(),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const currentUserId = await requireAuth(ctx);

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace || workspace.deletedAt) {
      throw new Error("Workspace not found");
    }

    const membership = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId_and_workspaceId", (q) =>
        q.eq("userId", args.userId).eq("workspaceId", args.workspaceId)
      )
      .unique();

    if (!membership) {
      throw new Error("User is not a member of this workspace");
    }

    if (membership.role === args.role) {
      return null;
    }

    const isAdmin = await isSiteAdmin(ctx, currentUserId);
    if (!isAdmin) {
      const currentRole = await getWorkspaceRole(ctx, currentUserId, args.workspaceId);

      if (args.role === "owner" && currentRole !== "owner") {
        throw new Error("Only owners can promote users to owner");
      }

      if (!currentRole || ROLE_HIERARCHY[currentRole] < ROLE_HIERARCHY.admin) {
        throw new Error("You must be a workspace admin to update roles");
      }

      if (ROLE_HIERARCHY[membership.role] >= ROLE_HIERARCHY[currentRole]) {
        throw new Error("Cannot modify the role of a user with equal or higher permissions");
      }
    }

    if (membership.role === "owner" && args.role !== "owner") {
      const owners = await ctx.db
        .query("workspaceToUser")
        .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
        .collect();

      const ownerCount = owners.filter((m) => m.role === "owner").length;
      if (ownerCount <= 1) {
        throw new Error("Cannot demote the last owner. Transfer ownership first.");
      }
    }

    await ctx.db.patch(membership._id, { role: args.role });
    return null;
  },
});

export const transferOwnership = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    newOwnerId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const currentUserId = await requireAuth(ctx);

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace || workspace.deletedAt) {
      throw new Error("Workspace not found");
    }

    const isAdmin = await isSiteAdmin(ctx, currentUserId);
    const currentMembership = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId_and_workspaceId", (q) =>
        q.eq("userId", currentUserId).eq("workspaceId", args.workspaceId)
      )
      .unique();

    if (!isAdmin && (!currentMembership?.role !== "owner")) {
      throw new Error("Only owners can transfer ownership");
    }

    const newOwnerMembership = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId_and_workspaceId", (q) =>
        q.eq("userId", args.newOwnerId).eq("workspaceId", args.workspaceId)
      )
      .unique();

    if (!newOwnerMembership) {
      throw new Error("New owner must be a member of the workspace");
    }

    if (newOwnerMembership.role === "owner") {
      return null;
    }

    await ctx.db.patch(newOwnerMembership._id, { role: "owner" });

    if (currentMembership?.role === "owner") {
      await ctx.db.patch(currentMembership._id, { role: "admin" });
    }

    return null;
  },
});

export const listUsersForWorkspace = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  returns: v.array(
    v.object({
      _id: v.id("workspaceToUser"),
      userId: v.string(),
      role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
    })
  ),
  handler: async (ctx, args) => {
    const currentUserId = await requireAuth(ctx);

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace || workspace.deletedAt) {
      throw new Error("Workspace not found");
    }

    const isAdmin = await isSiteAdmin(ctx, currentUserId);
    if (!isAdmin) {
      const membership = await ctx.db
        .query("workspaceToUser")
        .withIndex("by_userId_and_workspaceId", (q) =>
          q.eq("userId", currentUserId).eq("workspaceId", args.workspaceId)
        )
        .unique();

      if (!membership) {
        throw new Error("You do not have access to this workspace");
      }
    }

    const memberships = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    return memberships.map((m) => ({
      _id: m._id,
      userId: m.userId,
      role: m.role,
    }));
  },
});

export const getUserRole = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  returns: v.union(
    v.literal("owner"),
    v.literal("admin"),
    v.literal("member"),
    v.null()
  ),
  handler: async (ctx, args) => {
    const currentUserId = await requireAuth(ctx);

    if (await isSiteAdmin(ctx, currentUserId)) {
      return "owner";
    }

    const membership = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId_and_workspaceId", (q) =>
        q.eq("userId", currentUserId).eq("workspaceId", args.workspaceId)
      )
      .unique();

    return membership?.role ?? null;
  },
});

export const leaveWorkspace = mutation({
  args: {
    workspaceId: v.id("workspaces"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const currentUserId = await requireAuth(ctx);

    const membership = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId_and_workspaceId", (q) =>
        q.eq("userId", currentUserId).eq("workspaceId", args.workspaceId)
      )
      .unique();

    if (!membership) {
      throw new Error("You are not a member of this workspace");
    }

    if (membership.role === "owner") {
      throw new Error("Owners cannot leave the workspace. Transfer ownership first.");
    }

    await ctx.db.delete(membership._id);
    return null;
  },
});
