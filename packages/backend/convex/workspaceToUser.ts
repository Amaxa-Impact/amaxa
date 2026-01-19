import { v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { isSiteAdmin, requireAuth } from "./permissions";

// Workspace role type
export type WorkspaceRole = "owner" | "admin" | "member";

// Role hierarchy for permission checks
const ROLE_HIERARCHY: Record<WorkspaceRole, number> = {
  owner: 3,
  admin: 2,
  member: 1,
};

/**
 * Helper to get user's role in a workspace
 */
async function getWorkspaceRole(
  ctx: { db: { query: (table: "workspaceToUser") => any } },
  userId: string,
  workspaceId: Id<"workspaces">
): Promise<WorkspaceRole | null> {
  const membership = await ctx.db
    .query("workspaceToUser")
    .withIndex("by_userId_and_workspaceId", (q: any) =>
      q.eq("userId", userId).eq("workspaceId", workspaceId)
    )
    .unique();

  return membership?.role ?? null;
}

/**
 * Add a user to a workspace
 * Requires admin+ role or site admin
 */
export const addUser = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  returns: v.id("workspaceToUser"),
  handler: async (ctx, args) => {
    const currentUserId = await requireAuth(ctx);

    // Check workspace exists
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace || workspace.deletedAt) {
      throw new Error("Workspace not found");
    }

    // Check permissions
    const isAdmin = await isSiteAdmin(ctx, currentUserId);
    if (!isAdmin) {
      const currentRole = await getWorkspaceRole(ctx, currentUserId, args.workspaceId);
      if (!currentRole || ROLE_HIERARCHY[currentRole] < ROLE_HIERARCHY.admin) {
        throw new Error("You must be a workspace admin to add users");
      }
    }

    // Check if user already in workspace
    const existing = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId_and_workspaceId", (q) =>
        q.eq("userId", args.userId).eq("workspaceId", args.workspaceId)
      )
      .unique();

    if (existing) {
      throw new Error("User is already a member of this workspace");
    }

    // Add user
    return await ctx.db.insert("workspaceToUser", {
      workspaceId: args.workspaceId,
      userId: args.userId,
      role: args.role,
    });
  },
});

/**
 * Remove a user from a workspace
 * Requires admin+ role or site admin
 * Cannot remove the last owner
 */
export const removeUser = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    userId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const currentUserId = await requireAuth(ctx);

    // Check workspace exists
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace || workspace.deletedAt) {
      throw new Error("Workspace not found");
    }

    // Get the membership to remove
    const membership = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId_and_workspaceId", (q) =>
        q.eq("userId", args.userId).eq("workspaceId", args.workspaceId)
      )
      .unique();

    if (!membership) {
      throw new Error("User is not a member of this workspace");
    }

    // Check permissions
    const isAdmin = await isSiteAdmin(ctx, currentUserId);
    if (!isAdmin) {
      const currentRole = await getWorkspaceRole(ctx, currentUserId, args.workspaceId);
      if (!currentRole || ROLE_HIERARCHY[currentRole] < ROLE_HIERARCHY.admin) {
        throw new Error("You must be a workspace admin to remove users");
      }

      // Non-site-admins cannot remove owners
      if (membership.role === "owner") {
        throw new Error("Cannot remove workspace owner. Transfer ownership first.");
      }
    }

    // Prevent removing the last owner
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

/**
 * Update a user's role in a workspace
 * Owner promotion requires owner role
 * Cannot demote the last owner
 */
export const updateRole = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    userId: v.string(),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const currentUserId = await requireAuth(ctx);

    // Check workspace exists
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace || workspace.deletedAt) {
      throw new Error("Workspace not found");
    }

    // Get the membership to update
    const membership = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId_and_workspaceId", (q) =>
        q.eq("userId", args.userId).eq("workspaceId", args.workspaceId)
      )
      .unique();

    if (!membership) {
      throw new Error("User is not a member of this workspace");
    }

    // No change needed
    if (membership.role === args.role) {
      return null;
    }

    // Check permissions
    const isAdmin = await isSiteAdmin(ctx, currentUserId);
    if (!isAdmin) {
      const currentRole = await getWorkspaceRole(ctx, currentUserId, args.workspaceId);

      // Promoting to owner requires owner role
      if (args.role === "owner" && currentRole !== "owner") {
        throw new Error("Only owners can promote users to owner");
      }

      // Admin+ required for any role changes
      if (!currentRole || ROLE_HIERARCHY[currentRole] < ROLE_HIERARCHY.admin) {
        throw new Error("You must be a workspace admin to update roles");
      }

      // Cannot change roles of users with higher/equal role (except site admins)
      if (ROLE_HIERARCHY[membership.role] >= ROLE_HIERARCHY[currentRole]) {
        throw new Error("Cannot modify the role of a user with equal or higher permissions");
      }
    }

    // Prevent demoting the last owner
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

/**
 * Transfer workspace ownership to another user
 * Current owner is demoted to admin
 */
export const transferOwnership = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    newOwnerId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const currentUserId = await requireAuth(ctx);

    // Check workspace exists
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace || workspace.deletedAt) {
      throw new Error("Workspace not found");
    }

    // Check current user is owner (or site admin)
    const isAdmin = await isSiteAdmin(ctx, currentUserId);
    const currentMembership = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId_and_workspaceId", (q) =>
        q.eq("userId", currentUserId).eq("workspaceId", args.workspaceId)
      )
      .unique();

    if (!isAdmin && (!currentMembership || currentMembership.role !== "owner")) {
      throw new Error("Only owners can transfer ownership");
    }

    // Get new owner's membership
    const newOwnerMembership = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId_and_workspaceId", (q) =>
        q.eq("userId", args.newOwnerId).eq("workspaceId", args.workspaceId)
      )
      .unique();

    if (!newOwnerMembership) {
      throw new Error("New owner must be a member of the workspace");
    }

    // Already owner
    if (newOwnerMembership.role === "owner") {
      return null;
    }

    // Promote new owner
    await ctx.db.patch(newOwnerMembership._id, { role: "owner" });

    // Demote current owner to admin (only if they have a membership, i.e., not site admin)
    if (currentMembership && currentMembership.role === "owner") {
      await ctx.db.patch(currentMembership._id, { role: "admin" });
    }

    return null;
  },
});

/**
 * List all users in a workspace
 * Requires membership or site admin
 */
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

    // Check workspace exists
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace || workspace.deletedAt) {
      throw new Error("Workspace not found");
    }

    // Check permissions
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

/**
 * Get current user's role in a workspace
 */
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

    // Site admins have implicit owner access
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

/**
 * Leave a workspace (remove self)
 * Owners cannot leave - must transfer ownership first
 */
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

    // Owners cannot leave
    if (membership.role === "owner") {
      throw new Error("Owners cannot leave the workspace. Transfer ownership first.");
    }

    await ctx.db.delete(membership._id);
    return null;
  },
});
