import { ConvexError, v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { query } from "./_generated/server";
import { workspaceMutation, workspaceQuery } from "./custom";
import {
  assertUserInWorkspace,
  assertWorkspaceAdmin,
  assertWorkspaceOwner,
  isSiteAdmin,
  requireAuth,
} from "./permissions";

export type WorkspaceRole = "owner" | "admin" | "member";

const ROLE_HIERARCHY: Record<WorkspaceRole, number> = {
  owner: 3,
  admin: 2,
  member: 1,
};

async function getWorkspaceRole(
  ctx: QueryCtx,
  userId: string,
  workspaceId: Id<"workspaces">,
): Promise<WorkspaceRole | null> {
  const membership = await ctx.db
    .query("workspaceToUser")
    .withIndex("by_userId_and_workspaceId", (q) =>
      q.eq("userId", userId).eq("workspaceId", workspaceId),
    )
    .unique();

  return membership?.role ?? null;
}

export const addUser = workspaceMutation({
  args: {
    workspaceSlug: v.string(),
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  returns: v.id("workspaceToUser"),
  role: "admin",
  handler: async (ctx, args) => {
    const workspace = ctx.workspace;

    const existing = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId_and_workspaceId", (q) =>
        q.eq("userId", args.userId).eq("workspaceId", workspace._id),
      )
      .unique();

    if (existing) {
      throw new Error("User is already a member of this workspace");
    }

    return await ctx.db.insert("workspaceToUser", {
      workspaceId: workspace._id,
      userId: args.userId,
      role: args.role,
    });
  },
});

export const removeUser = workspaceMutation({
  args: {
    workspaceSlug: v.string(),
    userId: v.string(),
  },
  returns: v.null(),
  role: "admin",
  handler: async (ctx, args) => {
    const workspace = ctx.workspace;

    const membership = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId_and_workspaceId", (q) =>
        q.eq("userId", args.userId).eq("workspaceId", workspace._id),
      )
      .unique();

    if (!membership) {
      throw new Error("User is not a member of this workspace");
    }

    if (membership.role === "owner") {
      const owners = await ctx.db
        .query("workspaceToUser")
        .withIndex("by_workspaceId", (q) => q.eq("workspaceId", workspace._id))
        .collect();

      const ownerCount = owners.filter((m) => m.role === "owner").length;
      if (ownerCount <= 1) {
        throw new Error(
          "Cannot remove the last owner. Transfer ownership first.",
        );
      }
    }

    await ctx.db.delete(membership._id);
    return null;
  },
});

export const updateRole = workspaceMutation({
  args: {
    workspaceSlug: v.string(),
    userId: v.string(),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
  },
  returns: v.null(),
  role: "admin",
  handler: async (ctx, args) => {
    const workspace = ctx.workspace;

    const membership = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId_and_workspaceId", (q) =>
        q.eq("userId", args.userId).eq("workspaceId", workspace._id),
      )
      .unique();

    if (!membership) {
      throw new Error("User is not a member of this workspace");
    }

    if (membership.role === args.role) {
      return null;
    }

    const isAdmin = await isSiteAdmin(ctx, ctx.userId);
    if (!isAdmin) {
      const currentRole = await getWorkspaceRole(
        ctx,
        ctx.userId,
        workspace._id,
      );
      if (args.role === "owner" && currentRole !== "owner") {
        throw new Error("Only owners can promote users to owner");
      }

      if (
        ROLE_HIERARCHY[membership.role] >=
        ROLE_HIERARCHY[currentRole ?? "member"]
      ) {
        throw new Error(
          "Cannot modify the role of a user with equal or higher permissions",
        );
      }
    }

    if (membership.role === "owner" && args.role !== "owner") {
      const owners = await ctx.db
        .query("workspaceToUser")
        .withIndex("by_workspaceId", (q) => q.eq("workspaceId", workspace._id))
        .collect();

      const ownerCount = owners.filter((m) => m.role === "owner").length;
      if (ownerCount <= 1) {
        throw new Error(
          "Cannot demote the last owner. Transfer ownership first.",
        );
      }
    }

    await ctx.db.patch(membership._id, { role: args.role });
    return null;
  },
});

export const transferOwnership = workspaceMutation({
  args: {
    workspaceSlug: v.string(),
    newOwnerId: v.string(),
  },
  returns: v.null(),
  role: "owner",
  handler: async (ctx, args) => {
    const workspace = ctx.workspace;

    const currentMembership = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId_and_workspaceId", (q) =>
        q.eq("userId", ctx.userId).eq("workspaceId", workspace._id),
      )
      .unique();

    const newOwnerMembership = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId_and_workspaceId", (q) =>
        q.eq("userId", args.newOwnerId).eq("workspaceId", workspace._id),
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

export const listUsersForWorkspace = workspaceQuery({
  args: {
    workspaceSlug: v.string(),
  },
  returns: v.array(
    v.object({
      _id: v.id("workspaceToUser"),
      userId: v.string(),
      role: v.union(
        v.literal("owner"),
        v.literal("admin"),
        v.literal("member"),
      ),
    }),
  ),
  role: "member",
  handler: async (ctx) => {
    const workspace = ctx.workspace;

    const memberships = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", workspace._id))
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
    workspaceId: v.optional(v.id("workspaces")),
    slug: v.optional(v.string()),
  },
  returns: v.union(
    v.literal("owner"),
    v.literal("admin"),
    v.literal("member"),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const currentUserId = await requireAuth(ctx);

    if (!args.workspaceId && !args.slug) {
      throw new ConvexError("Either workspaceId or slug must be provided");
    }

    if (await isSiteAdmin(ctx, currentUserId)) {
      return "owner";
    }

    if (args.workspaceId !== undefined) {
      if (args.workspaceId) {
        return await getWorkspaceRole(ctx, currentUserId, args.workspaceId);
      }
    }

    if (args.slug !== undefined) {
      if (typeof args.slug === "string") {
        const workspace = await ctx.db
          .query("workspaces")
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .withIndex("by_slug", (q) => q.eq("slug", args.slug!))
          .unique();
        if (!workspace) {
          throw new ConvexError("Workspace not found");
        }

        const membership = await ctx.db
          .query("workspaceToUser")
          .withIndex("by_userId_and_workspaceId", (q) =>
            q.eq("userId", currentUserId).eq("workspaceId", workspace._id),
          )
          .unique();

        return membership?.role ?? null;
      }
    }

    return null;
  },
});

export const leaveWorkspace = workspaceMutation({
  args: {
    workspaceSlug: v.string(),
  },
  returns: v.null(),
  role: "member",
  handler: async (ctx) => {
    const workspace = ctx.workspace;

    const membership = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId_and_workspaceId", (q) =>
        q.eq("userId", ctx.userId).eq("workspaceId", workspace._id),
      )
      .unique();

    if (!membership) {
      throw new ConvexError("You are not a member of this workspace");
    }

    if (membership.role === "owner") {
      throw new ConvexError(
        "Owners cannot leave the workspace. Transfer ownership first.",
      );
    }

    await ctx.db.delete(membership._id);
    return null;
  },
});

export const checkIfCanAccess = query({
  args: {
    role: v.union(v.literal("member"), v.literal("owner"), v.literal("admin")),
    accessToken: v.string(),
    workspaceSlug: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const { accessToken, role, workspaceSlug } = args;

    const workspace = await ctx.db
      .query("workspaces")
      .withIndex("by_slug", (q) => q.eq("slug", workspaceSlug))
      .unique();

    if (!workspace) {
      throw new ConvexError("Workspace not found");
    }

    const membership = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId_and_workspaceId", (q) =>
        q.eq("userId", accessToken).eq("workspaceId", workspace._id),
      )
      .unique();

    if (!membership) {
      return false;
    }

    if (role === "member") {
      await assertUserInWorkspace(ctx, accessToken, workspace._id);
    } else if (role === "admin") {
      await assertWorkspaceAdmin(ctx, accessToken, workspace._id);
    } else {
      await assertWorkspaceOwner(ctx, accessToken, workspace._id);
    }
    return membership.role === args.role;
  },
});
