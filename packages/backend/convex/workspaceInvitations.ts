import { ConvexError, v } from "convex/values";

import { internal } from "./_generated/api";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { isSiteAdmin, requireAuth } from "./permissions";
import { workspaceMutation, workspaceQuery } from "./custom";

function generateToken(): string {
  // Use crypto.randomUUID() for cryptographically secure token generation
  return crypto.randomUUID().replace(/-/g, "");
}

const invitationWithWorkspaceValidator = v.object({
  _id: v.id("workspaceInvitations"),
  _creationTime: v.number(),
  workspaceId: v.id("workspaces"),
  email: v.string(),
  role: v.union(v.literal("admin"), v.literal("member")),
  invitedBy: v.string(),
  createdAt: v.number(),
  expiresAt: v.number(),
  // Token intentionally omitted - should only be sent via email
  status: v.union(
    v.literal("pending"),
    v.literal("accepted"),
    v.literal("expired"),
    v.literal("revoked"),
  ),
  workspaceName: v.string(),
  workspaceSlug: v.string(),
});

export const listPendingForUser = query({
  args: {},
  returns: v.array(invitationWithWorkspaceValidator),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const email = identity?.email;
    if (!email) {
      return [];
    }

    

    const invitations = await ctx.db
      .query("workspaceInvitations")
      .withIndex("by_email", (q) => q.eq("email", email))
      .collect();

    const pendingInvitations = invitations.filter(
      (inv) => inv.status === "pending" && inv.expiresAt > Date.now(),
    );

    const results: {
      _id: typeof pendingInvitations[number]["_id"];
      _creationTime: number;
      workspaceId: typeof pendingInvitations[number]["workspaceId"];
      email: string;
      role: "admin" | "member";
      invitedBy: string;
      createdAt: number;
      expiresAt: number;
      status: "pending" | "accepted" | "expired" | "revoked";
      workspaceName: string;
      workspaceSlug: string;
    }[] = [];
    for (const inv of pendingInvitations) {
      const workspace = await ctx.db.get(inv.workspaceId);
      if (workspace && !workspace.deletedAt) {
        results.push({
          _id: inv._id,
          _creationTime: inv._creationTime,
          workspaceId: inv.workspaceId,
          email: inv.email,
          role: inv.role,
          invitedBy: inv.invitedBy,
          createdAt: inv.createdAt,
          expiresAt: inv.expiresAt,
          status: inv.status,
          workspaceName: workspace.name,
          workspaceSlug: workspace.slug,
        });
      }
    }
    return results;
  },
});

export const acceptInvitation = mutation({
  args: {
    invitationId: v.id("workspaceInvitations"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const identity = await ctx.auth.getUserIdentity();

    if (!identity?.email) {
      throw new ConvexError("User email not found");
    }

    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) {
      throw new ConvexError("Invitation not found");
    }

    if (invitation.email.toLowerCase() !== identity.email.toLowerCase()) {
      throw new ConvexError("This invitation is not for you");
    }

    if (invitation.status !== "pending") {
      throw new ConvexError("Invitation is no longer pending");
    }

    if (invitation.expiresAt < Date.now()) {
      await ctx.db.patch(args.invitationId, { status: "expired" });
      throw new ConvexError("Invitation has expired");
    }

    const workspace = await ctx.db.get(invitation.workspaceId);
    if (!workspace || workspace.deletedAt) {
      throw new ConvexError("Workspace not found");
    }

    const existingMembership = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId_and_workspaceId", (q) =>
        q.eq("userId", userId).eq("workspaceId", invitation.workspaceId),
      )
      .unique();

    if (existingMembership) {
      await ctx.db.patch(args.invitationId, { status: "accepted" });
      return null;
    }

    await ctx.db.insert("workspaceToUser", {
      workspaceId: invitation.workspaceId,
      userId,
      role: invitation.role,
    });

    await ctx.db.patch(args.invitationId, { status: "accepted" });

    return null;
  },
});

export const declineInvitation = mutation({
  args: {
    invitationId: v.id("workspaceInvitations"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const identity = await ctx.auth.getUserIdentity();

    if (!identity?.email) {
      throw new ConvexError("User email not found");
    }

    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) {
      throw new ConvexError("Invitation not found");
    }

    if (invitation.email.toLowerCase() !== identity.email.toLowerCase()) {
      throw new ConvexError("This invitation is not for you");
    }

    if (invitation.status !== "pending") {
      throw new ConvexError("Invitation is no longer pending");
    }

    await ctx.db.patch(args.invitationId, { status: "revoked" });

    return null;
  },
});

export const createInvitation = workspaceMutation({
  args: {
    workspaceSlug: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  returns: v.id("workspaceInvitations"),
  role: "admin",
  handler: async (ctx, args) => {
    const workspaceId = ctx.workspace._id;

    const existingInvitation = await ctx.db
      .query("workspaceInvitations")
      .withIndex("by_email_and_workspaceId", (q) =>
        q.eq("email", args.email.toLowerCase()).eq("workspaceId", workspaceId),
      )
      .unique();

    if (existingInvitation?.status === "pending") {
      throw new ConvexError("An invitation already exists for this email");
    }

    const now = Date.now();
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days
    const token = generateToken();

    const invitationId = await ctx.db.insert("workspaceInvitations", {
      workspaceId,
      email: args.email.toLowerCase(),
      role: args.role,
      invitedBy: ctx.userId,
      createdAt: now,
      expiresAt,
      token,
      status: "pending",
    });

    await ctx.scheduler.runAfter(
      0,
      internal.workspaceInvitationEmail.sendInvitationEmail,
      {
        invitationId,
        to: args.email.toLowerCase(),
        workspaceName: ctx.workspace.name,
        token,
        role: args.role,
      },
    );

    return invitationId;
  },
});

export const revokeInvitation = mutation({
  args: {
    invitationId: v.id("workspaceInvitations"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) {
      throw new ConvexError("Invitation not found");
    }

    if (invitation.status !== "pending") {
      throw new ConvexError("Invitation is no longer pending");
    }

    const isAdmin = await isSiteAdmin(ctx, userId);
    if (!isAdmin) {
      const membership = await ctx.db
        .query("workspaceToUser")
        .withIndex("by_userId_and_workspaceId", (q) =>
          q.eq("userId", userId).eq("workspaceId", invitation.workspaceId),
        )
        .unique();

      if (!membership || membership.role === "member") {
        throw new ConvexError(
          "You must be a workspace admin to revoke invitations",
        );
      }
    }

    await ctx.db.patch(args.invitationId, { status: "revoked" });

    return null;
  },
});

export const listForWorkspace = workspaceQuery({
  args: {
    workspaceSlug: v.string(),
  },
  returns: v.array(
    v.object({
      _id: v.id("workspaceInvitations"),
      _creationTime: v.number(),
      workspaceId: v.id("workspaces"),
      email: v.string(),
      role: v.union(v.literal("admin"), v.literal("member")),
      invitedBy: v.string(),
      createdAt: v.number(),
      expiresAt: v.number(),
      // Token intentionally omitted - should only be sent via email
      status: v.union(
        v.literal("pending"),
        v.literal("accepted"),
        v.literal("expired"),
        v.literal("revoked"),
      ),
    }),
  ),
  role: "member",
  handler: async (ctx) => {
    const workspaceId = ctx.workspace._id;

    const invitations = await ctx.db
      .query("workspaceInvitations")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", workspaceId))
      .collect();

    // Strip tokens from response - they should only be sent via email
    return invitations.map((inv) => ({
      _id: inv._id,
      _creationTime: inv._creationTime,
      workspaceId: inv.workspaceId,
      email: inv.email,
      role: inv.role,
      invitedBy: inv.invitedBy,
      createdAt: inv.createdAt,
      expiresAt: inv.expiresAt,
      status: inv.status,
    }));
  },
});

export const getByToken = query({
  args: {
    token: v.string(),
  },
  returns: v.union(
    v.object({
      _id: v.id("workspaceInvitations"),
      email: v.string(),
      role: v.union(v.literal("admin"), v.literal("member")),
      expiresAt: v.number(),
      status: v.union(
        v.literal("pending"),
        v.literal("accepted"),
        v.literal("expired"),
        v.literal("revoked"),
      ),
      workspaceName: v.string(),
      workspaceSlug: v.string(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("workspaceInvitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!invitation) {
      return null;
    }

    const workspace = await ctx.db.get(invitation.workspaceId);
    if (!workspace || workspace.deletedAt) {
      return null;
    }

    const status =
      invitation.status === "pending" && invitation.expiresAt < Date.now()
        ? "expired"
        : invitation.status;

    return {
      _id: invitation._id,
      email: invitation.email,
      role: invitation.role,
      expiresAt: invitation.expiresAt,
      status,
      workspaceName: workspace.name,
      workspaceSlug: workspace.slug,
    };
  },
});

export const acceptByToken = mutation({
  args: {
    token: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    workspaceSlug: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const identity = await ctx.auth.getUserIdentity();

    if (!identity?.email) {
      return { success: false, error: "User email not found" };
    }

    const invitation = await ctx.db
      .query("workspaceInvitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!invitation) {
      return { success: false, error: "Invitation not found" };
    }

    if (invitation.email.toLowerCase() !== identity.email.toLowerCase()) {
      return {
        success: false,
        error: "This invitation was sent to a different email address",
      };
    }

    if (invitation.status !== "pending") {
      return { success: false, error: "Invitation is no longer valid" };
    }

    if (invitation.expiresAt < Date.now()) {
      await ctx.db.patch(invitation._id, { status: "expired" });
      return { success: false, error: "Invitation has expired" };
    }

    const workspace = await ctx.db.get(invitation.workspaceId);
    if (!workspace || workspace.deletedAt) {
      return { success: false, error: "Workspace no longer exists" };
    }

    const existingMembership = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId_and_workspaceId", (q) =>
        q.eq("userId", userId).eq("workspaceId", invitation.workspaceId),
      )
      .unique();

    if (!existingMembership) {
      await ctx.db.insert("workspaceToUser", {
        workspaceId: invitation.workspaceId,
        userId,
        role: invitation.role,
      });
    }

    await ctx.db.patch(invitation._id, { status: "accepted" });

    return { success: true, workspaceSlug: workspace.slug };
  },
});

export const resendInvitation = mutation({
  args: {
    invitationId: v.id("workspaceInvitations"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) {
      throw new ConvexError("Invitation not found");
    }

    if (invitation.status !== "pending") {
      throw new ConvexError("Invitation is no longer pending");
    }

    const workspace = await ctx.db.get(invitation.workspaceId);
    if (!workspace || workspace.deletedAt) {
      throw new ConvexError("Workspace not found");
    }

    const isAdmin = await isSiteAdmin(ctx, userId);
    if (!isAdmin) {
      const membership = await ctx.db
        .query("workspaceToUser")
        .withIndex("by_userId_and_workspaceId", (q) =>
          q.eq("userId", userId).eq("workspaceId", invitation.workspaceId),
        )
        .unique();

      if (!membership || membership.role === "member") {
        throw new ConvexError(
          "You must be a workspace admin to resend invitations",
        );
      }
    }

    const now = Date.now();
    const newExpiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days
    const newToken = generateToken();

    await ctx.db.patch(args.invitationId, {
      expiresAt: newExpiresAt,
      token: newToken,
    });

    await ctx.scheduler.runAfter(
      0,
      internal.workspaceInvitationEmail.sendInvitationEmail,
      {
        invitationId: args.invitationId,
        to: invitation.email,
        workspaceName: workspace.name,
        token: newToken,
        role: invitation.role,
      },
    );

    return null;
  },
});

export const cleanupExpired = internalMutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    let processedCount = 0;

    // Mark pending invitations as expired using the status index
    const pendingInvitations = await ctx.db
      .query("workspaceInvitations")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    for (const invitation of pendingInvitations) {
      if (invitation.expiresAt < now) {
        await ctx.db.patch(invitation._id, { status: "expired" });
        processedCount++;
      }
    }

    // Delete old expired invitations
    const expiredInvitations = await ctx.db
      .query("workspaceInvitations")
      .withIndex("by_status", (q) => q.eq("status", "expired"))
      .collect();

    for (const invitation of expiredInvitations) {
      if (invitation.createdAt < thirtyDaysAgo) {
        await ctx.db.delete(invitation._id);
        processedCount++;
      }
    }

    // Delete old revoked invitations
    const revokedInvitations = await ctx.db
      .query("workspaceInvitations")
      .withIndex("by_status", (q) => q.eq("status", "revoked"))
      .collect();

    for (const invitation of revokedInvitations) {
      if (invitation.createdAt < thirtyDaysAgo) {
        await ctx.db.delete(invitation._id);
        processedCount++;
      }
    }

    // Delete old accepted invitations
    const acceptedInvitations = await ctx.db
      .query("workspaceInvitations")
      .withIndex("by_status", (q) => q.eq("status", "accepted"))
      .collect();

    for (const invitation of acceptedInvitations) {
      if (invitation.createdAt < thirtyDaysAgo) {
        await ctx.db.delete(invitation._id);
        processedCount++;
      }
    }

    return processedCount;
  },
});

export const listPendingForWorkspace = workspaceQuery({
  args: {
    workspaceSlug: v.string(),
  },
  returns: v.array(
    v.object({
      _id: v.id("workspaceInvitations"),
      email: v.string(),
      role: v.union(v.literal("admin"), v.literal("member")),
      createdAt: v.number(),
      expiresAt: v.number(),
    }),
  ),
  role: "admin",
  handler: async (ctx) => {
    const workspaceId = ctx.workspace._id;

    const invitations = await ctx.db
      .query("workspaceInvitations")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", workspaceId))
      .collect();

    const now = Date.now();

    return invitations
      .filter((inv) => inv.status === "pending" && inv.expiresAt > now)
      .map((inv) => ({
        _id: inv._id,
        email: inv.email,
        role: inv.role,
        createdAt: inv.createdAt,
        expiresAt: inv.expiresAt,
      }));
  },
});

export const getInvitationDetails = internalQuery({
  args: {
    invitationId: v.id("workspaceInvitations"),
  },
  returns: v.union(
    v.object({
      email: v.string(),
      workspaceName: v.string(),
      token: v.string(),
      role: v.union(v.literal("admin"), v.literal("member")),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) {
      return null;
    }

    const workspace = await ctx.db.get(invitation.workspaceId);
    if (!workspace) {
      return null;
    }

    return {
      email: invitation.email,
      workspaceName: workspace.name,
      token: invitation.token,
      role: invitation.role,
    };
  },
});
