import type { Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

export type UserRole = "coach" | "member";

/**
 * Get the authenticated user's ID from the context
 * Throws an error if the user is not authenticated
 */
export async function requireAuth(
  ctx: QueryCtx | MutationCtx
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
  projectId: Id<"projects">
): Promise<UserRole | null> {
  const assignment = await ctx.db
    .query("userToProject")
    .withIndex("by_userId_and_projectId", (q) =>
      q.eq("userId", userId).eq("projectId", projectId)
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
  projectId: Id<"projects">
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
  projectId: Id<"projects">
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
  projectId: Id<"projects">
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
  projectId: Id<"projects">
): Promise<boolean> {
  const role = await getUserRole(ctx, userId, projectId);
  return role === "coach";
}

export type SiteUserRole = "admin" | "coach";

export async function getSiteUser(ctx: QueryCtx | MutationCtx, userId: string) {
  return await ctx.db
    .query("siteUser")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();
}

export async function isSiteAdmin(
  ctx: QueryCtx | MutationCtx,
  userId: string
): Promise<boolean> {
  const siteUser = await getSiteUser(ctx, userId);
  return siteUser?.role === "admin";
}

export async function assertSiteAdmin(
  ctx: QueryCtx | MutationCtx,
  userId: string
): Promise<void> {
  const isAdmin = await isSiteAdmin(ctx, userId);
  if (!isAdmin) {
    throw new Error("User must be a site admin to perform this action");
  }
}

export async function requireSiteAdmin(
  ctx: QueryCtx | MutationCtx
): Promise<string> {
  const userId = await requireAuth(ctx);
  console.log("userId:", userId);

  await assertSiteAdmin(ctx, userId);
  return userId;
}
