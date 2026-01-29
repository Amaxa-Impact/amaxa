import { cache } from "react";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { Effect } from "effect";
import { LRUCache } from "lru-cache";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";

import { verifySession } from "../auth/dal";

type ProjectRole = "coach" | "member";

type CacheKey = `project:${string}:userId:${string}`;

const permissionCache = new LRUCache<CacheKey, { role: ProjectRole | null }>({
  max: 1_000,
  ttl: 1000 * 60 * 5,
});

const getSession = cache(() => verifySession());

export const hasProjectAccess = (projectId: Id<"projects">) =>
  Effect.gen(function* () {
    const session = yield* Effect.promise(() => getSession());

    const cacheKey: CacheKey = `project:${projectId}:userId:${session.userId}`;

    const cached = permissionCache.get(cacheKey);
    if (cached !== undefined) {
      return {
        authorized: cached.role !== null,
        role: cached.role,
      } as const;
    }

    const { isSiteAdmin, projectRole } = yield* Effect.all({
      isSiteAdmin: Effect.promise(() =>
        fetchQuery(api.auth.getIsSiteAdmin, {}, { token: session.accessToken }),
      ),
      projectRole: Effect.promise(() =>
        fetchQuery(
          api.projects.getUserProjectRole,
          { projectId },
          { token: session.accessToken },
        ),
      ),
    });

    if (isSiteAdmin) {
      permissionCache.set(cacheKey, { role: "coach" });
      return { authorized: true, role: "coach" as const } as const;
    }

    if (projectRole !== null) {
      permissionCache.set(cacheKey, { role: projectRole });
      return { authorized: true, role: projectRole } as const;
    }

    permissionCache.set(cacheKey, { role: null });
    return { authorized: false, role: null } as const;
  });

export async function assertProjectAccess(projectId: Id<"projects">) {
  const result = await Effect.runPromise(
    hasProjectAccess(projectId).pipe(
      Effect.catchAll(() =>
        Effect.succeed({ authorized: false, role: null } as const),
      ),
    ),
  );

  if (!result.authorized) {
    notFound();
  }

  return result;
}

export async function hasProjectAccessAsync(
  projectId: Id<"projects">,
): Promise<{ authorized: boolean; role: ProjectRole | null }> {
  const session = await verifySession();

  // Use userId for cache key (stable) not accessToken (rotates)
  const cacheKey: CacheKey = `project:${projectId}:userId:${session.userId}`;

  const cached = permissionCache.get(cacheKey);
  if (cached !== undefined) {
    return {
      authorized: cached.role !== null,
      role: cached.role,
    };
  }

  const isSiteAdmin = await fetchQuery(
    api.auth.getIsSiteAdmin,
    {},
    { token: session.accessToken },
  );

  if (isSiteAdmin) {
    permissionCache.set(cacheKey, { role: "coach" });
    return { authorized: true, role: "coach" };
  }

  const projectRole = await fetchQuery(
    api.projects.getUserProjectRole,
    { projectId },
    { token: session.accessToken },
  );

  if (projectRole !== null) {
    permissionCache.set(cacheKey, { role: projectRole });
    return { authorized: true, role: projectRole };
  }

  permissionCache.set(cacheKey, { role: null });
  return { authorized: false, role: null };
}
