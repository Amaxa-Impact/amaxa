import type { GenericActionCtx, GenericDataModel } from "convex/server";

import type { Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { api } from "./_generated/api";

export type UserRole = "coach" | "member";
type HttpActionCtx = GenericActionCtx<GenericDataModel>;

/**
 * Get the authenticated user's ID from the context
 * Throws an error if the user is not authenticated
 */
export async function requireAuth(
  ctx: QueryCtx | MutationCtx,
): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity?.subject) {
    throw new Error("User not authenticated");
  }
  return identity.subject;
}

/**
 * Get a user's role in a project
 * Returns null if the user is not in the project
 */
export async function getUserRole(
  ctx: QueryCtx | MutationCtx,
  userId: string,
  projectId: Id<"projects">,
): Promise<UserRole | null> {
  const assignment = await ctx.db
    .query("userToProject")
    .withIndex("by_userId_and_projectId", (q) =>
      q.eq("userId", userId).eq("projectId", projectId),
    )
    .unique();

  if (!assignment) {
    return null;
  }

  return assignment.role as UserRole;
}

/**
 * Assert that a user has access to a project
 * Throws an error if the user is not in the project
 */
export async function assertUserInProject(
  ctx: QueryCtx | MutationCtx,
  userId: string,
  projectId: Id<"projects">,
): Promise<void> {
  const role = await getUserRole(ctx, userId, projectId);
  if (role === null) {
    throw new Error("User does not have access to this project");
  }
}

/**
 * Assert that a user is a coach in a project
 * Throws an error if the user is not a coach
 */
export async function assertUserIsCoach(
  ctx: QueryCtx | MutationCtx,
  userId: string,
  projectId: Id<"projects">,
): Promise<void> {
  const role = await getUserRole(ctx, userId, projectId);
  if (role !== "coach") {
    throw new Error("User must be a coach to perform this action");
  }
}

/**
 * Check if a user has access to a project (non-throwing version)
 */
export async function hasAccess(
  ctx: QueryCtx | MutationCtx,
  userId: string,
  projectId: Id<"projects">,
): Promise<boolean> {
  const role = await getUserRole(ctx, userId, projectId);
  return role !== null;
}

/**
 * Check if a user is a coach in a project (non-throwing version)
 */
export async function isCoach(
  ctx: QueryCtx | MutationCtx,
  userId: string,
  projectId: Id<"projects">,
): Promise<boolean> {
  const role = await getUserRole(ctx, userId, projectId);
  return role === "coach";
}

export type SiteUserRole = "admin" | "coach";

// Workspace role types
export type WorkspaceRole = "owner" | "admin" | "member";

// Role hierarchy for permission checks
const WORKSPACE_ROLE_HIERARCHY: Record<WorkspaceRole, number> = {
  owner: 3,
  admin: 2,
  member: 1,
};

export async function getSiteUser(ctx: QueryCtx | MutationCtx, userId: string) {
  return await ctx.db
    .query("siteUser")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();
}

export async function isSiteAdmin(
  ctx: QueryCtx | MutationCtx,
  userId: string,
): Promise<boolean> {
  const siteUser = await getSiteUser(ctx, userId);
  return siteUser?.role === "admin";
}

export async function assertSiteAdmin(
  ctx: QueryCtx | MutationCtx,
  userId: string,
): Promise<void> {
  const isAdmin = await isSiteAdmin(ctx, userId);
  if (!isAdmin) {
    throw new Error("User must be a site admin to perform this action");
  }
}

export async function requireSiteAdmin(
  ctx: QueryCtx | MutationCtx,
): Promise<string> {
  const userId = await requireAuth(ctx);

  await assertSiteAdmin(ctx, userId);
  return userId;
}

export async function requireSiteAdminAction(
  ctx: HttpActionCtx,
): Promise<boolean> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity?.subject) {
    return false;
  }

  const status = await ctx.runQuery(api.auth.getCurrentUserStatus);
  return status.isAdmin === true;
}

// ============================================
// Workspace Permission Helpers
// ============================================

/**
 * Get a user's role in a workspace
 * Returns null if the user is not in the workspace
 */
export async function getWorkspaceRole(
  ctx: QueryCtx | MutationCtx,
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

/**
 * Check if user has access to a workspace (member or higher)
 * Site admins bypass this check
 */
export async function hasWorkspaceAccess(
  ctx: QueryCtx | MutationCtx,
  userId: string,
  workspaceId: Id<"workspaces">,
): Promise<boolean> {
  // Site admins have access to all workspaces
  if (await isSiteAdmin(ctx, userId)) {
    return true;
  }

  const role = await getWorkspaceRole(ctx, userId, workspaceId);
  return role !== null;
}

/**
 * Assert that a user has access to a workspace
 * Throws an error if the user is not a member
 * Site admins bypass this check
 */
export async function assertUserInWorkspace(
  ctx: QueryCtx | MutationCtx,
  userId: string,
  workspaceId: Id<"workspaces">,
): Promise<void> {
  // Site admins bypass all permission checks
  if (await isSiteAdmin(ctx, userId)) {
    return;
  }

  const role = await getWorkspaceRole(ctx, userId, workspaceId);
  if (role === null) {
    throw new Error("User does not have access to this workspace");
  }
}

/**
 * Assert that a user is an admin (or owner) in a workspace
 * Throws an error if the user doesn't have admin+ role
 * Site admins bypass this check
 */
export async function assertWorkspaceAdmin(
  ctx: QueryCtx | MutationCtx,
  userId: string,
  workspaceId: Id<"workspaces">,
): Promise<void> {
  // Site admins bypass all permission checks
  if (await isSiteAdmin(ctx, userId)) {
    return;
  }

  const role = await getWorkspaceRole(ctx, userId, workspaceId);
  if (!role || WORKSPACE_ROLE_HIERARCHY[role] < WORKSPACE_ROLE_HIERARCHY.admin) {
    throw new Error("User must be a workspace admin to perform this action");
  }
}

/**
 * Assert that a user is an owner of a workspace
 * Throws an error if the user is not an owner
 * Site admins bypass this check
 */
export async function assertWorkspaceOwner(
  ctx: QueryCtx | MutationCtx,
  userId: string,
  workspaceId: Id<"workspaces">,
): Promise<void> {
  // Site admins bypass all permission checks
  if (await isSiteAdmin(ctx, userId)) {
    return;
  }

  const role = await getWorkspaceRole(ctx, userId, workspaceId);
  if (role !== "owner") {
    throw new Error("User must be the workspace owner to perform this action");
  }
}

/**
 * Check if user is workspace admin (non-throwing version)
 * Site admins return true
 */
export async function isWorkspaceAdmin(
  ctx: QueryCtx | MutationCtx,
  userId: string,
  workspaceId: Id<"workspaces">,
): Promise<boolean> {
  if (await isSiteAdmin(ctx, userId)) {
    return true;
  }

  const role = await getWorkspaceRole(ctx, userId, workspaceId);
  return role !== null && WORKSPACE_ROLE_HIERARCHY[role] >= WORKSPACE_ROLE_HIERARCHY.admin;
}

/**
 * Check if user is workspace owner (non-throwing version)
 * Site admins return true
 */
export async function isWorkspaceOwner(
  ctx: QueryCtx | MutationCtx,
  userId: string,
  workspaceId: Id<"workspaces">,
): Promise<boolean> {
  if (await isSiteAdmin(ctx, userId)) {
    return true;
  }

  const role = await getWorkspaceRole(ctx, userId, workspaceId);
  return role === "owner";
}

/**
 * Get the effective workspace role for a user
 * Site admins get "owner" role implicitly
 */
export async function getEffectiveWorkspaceRole(
  ctx: QueryCtx | MutationCtx,
  userId: string,
  workspaceId: Id<"workspaces">,
): Promise<WorkspaceRole | null> {
  if (await isSiteAdmin(ctx, userId)) {
    return "owner"; // Site admins have implicit owner access
  }

  return await getWorkspaceRole(ctx, userId, workspaceId);
}
