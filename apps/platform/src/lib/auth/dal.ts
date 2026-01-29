import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { env } from "@/env";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { fetchQuery } from "convex/nextjs";
import { LRUCache } from "lru-cache";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import type { WorkspaceRole } from "@amaxa/backend/workspaces";
import { api } from "@amaxa/backend/_generated/api";

export const projectRoles = ["coach", "member"] as const;
type ProjectRole = (typeof projectRoles)[number];

/**
 * Project Slug: Role For Workspace
 */
type GetWorkspaceCache = `${string}:${WorkspaceRole}`;

/**
 * Project Id: Role For Project
 */
type GetProjectCache = `${Id<"projects">}:${ProjectRole}`;

export const workspaceCacheKey = (
  workspace: string,
  role: WorkspaceRole,
): GetWorkspaceCache => `${workspace}:${role}`;

export const projectCacheKey = (
  projectId: Id<"projects">,
  role: ProjectRole,
): GetProjectCache => `${projectId}:${role}`;

const adminCache = new LRUCache<string, boolean>({
  max: 1000,
  ttl: 1000 * 60 * 5, // 5 minutes
});

export const workspaceCache = new LRUCache<GetWorkspaceCache, boolean>({
  max: 1000,
  ttl: 1000 * 60 * 5, // 5 minutes
});

export const projectCache = new LRUCache<GetProjectCache, boolean>({
  max: 1000,
  ttl: 1000 * 60 * 5, // 5 minutes
});

/**
 * Per-request deduplication for session verification.
 * React.cache() ensures multiple calls within the same render
 * only hit WorkOS once.
 */
export const verifySession = cache(async () => {
  const auth = await withAuth({ ensureSignedIn: true });

  if (!auth.accessToken) {
    redirect("/sign-in");
  }

  return {
    user: auth.user,
    accessToken: auth.accessToken,
    userId: auth.user.id,
  };
});

/**
 * Combined per-request + cross-request caching for site admin status.
 * - React.cache() handles per-request deduplication
 * - LRU cache handles cross-request caching with userId key (stable)
 */
export const getSiteAdminStatus = cache(async () => {
  const session = await verifySession();

  const cached = adminCache.get(session.userId);

  if (cached !== undefined) {
    const shouldRevalidate = cached === false && env.NODE_ENV !== "production";
    if (!shouldRevalidate) {
      return { isAdmin: cached, ...session };
    }
  }

  const isAdmin = await fetchQuery(
    api.auth.getIsSiteAdmin,
    {},
    { token: session.accessToken },
  );

  adminCache.set(session.userId, isAdmin);
  return { isAdmin, ...session };
});

export const canAccessWorkspace = cache(async (slug: GetWorkspaceCache) => {
  const session = await verifySession();
  const [workspaceSlug, requiredRole] = slug.split(":") as [
    string,
    WorkspaceRole,
  ];

  const cached = workspaceCache.get(slug);
  if (cached !== undefined) {
    return { isAuthorized: cached, ...session };
  }

  const canAccess = await fetchQuery(
    api.workspaceToUser.checkIfCanAccess,
    {
      workspaceSlug,
      accessToken: session.accessToken,
      role: requiredRole,
    },
    { token: session.accessToken },
  );

  workspaceCache.set(slug, canAccess);
  return { isAuthorized: canAccess, ...session };
});

export const canAccessProject = cache(async (slug: GetProjectCache) => {
  const session = await verifySession();
  const [projectId, role] = slug.split(":") as [Id<"projects">, ProjectRole];

  const cached = projectCache.get(slug);

  if (cached !== undefined) {
    return { isAuthorized: cached, ...session };
  }

  const canAccess = await fetchQuery(
    api.projects.checkProjectAccess,
    {
      projectId,
      userId: session.accessToken,
      role,
    },
    { token: session.accessToken },
  );

  projectCache.set(slug, canAccess);
  return { isAuthorized: canAccess, ...session };
});

/**
 * Requires the current user to be a site admin.
 * Redirects to /unauthorized if not.
 */
export async function requireSiteAdmin() {
  const { isAdmin, accessToken } = await getSiteAdminStatus();
  if (!isAdmin) {
    redirect("/unauthorized");
  }
  return { accessToken };
}

/**
 * Requires the current user to be a workspace admin.
 * Redirects to /unauthorized if not.
 */
export async function requireWorkspaceAdmin(slug: GetWorkspaceCache) {
  const { isAuthorized, accessToken } = await canAccessWorkspace(slug);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }
  return { accessToken };
}

/**
 * Requires the current user to be a project admin.
 * Redirects to /unauthorized if not.
 */
export async function requireProjectAdmin(slug: GetProjectCache) {
  const { isAuthorized, accessToken } = await canAccessProject(slug);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }
  return { accessToken };
}

/**
 * Gets session without requiring sign-in.
 * Returns null if not authenticated.
 */
export const getOptionalSession = cache(async () => {
  const auth = await withAuth();

  if (!auth.user || !auth.accessToken) {
    return null;
  }

  return {
    user: auth.user,
    accessToken: auth.accessToken,
    userId: auth.user.id,
  };
});
