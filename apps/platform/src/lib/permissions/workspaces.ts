import { cache } from "react";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { Effect } from "effect";
import { LRUCache } from "lru-cache";

import { api } from "@amaxa/backend/_generated/api";

import { verifySession } from "../auth/dal";
import { tryCatch } from "../try-catch";

// Use userId for stable cache key (not accessToken which rotates)
type CacheKey = `workspace:${string}:userId:${string}`;

const permissionCache = new LRUCache<CacheKey, boolean>({
  max: 1_000,
  ttl: 1000 * 60 * 5,
});

const getSession = cache(() => verifySession());

const genForSlug = (slug: string) =>
  Effect.gen(function* () {
    if (!slug) {
      return { authorized: false, role: null } as const;
    }

    const session = yield* Effect.promise(() => getSession());
    // Use userId for cache key (stable) not accessToken (rotates)
    const cacheKey: CacheKey = `workspace:${slug}:userId:${session.userId}`;

    const cached = permissionCache.get(cacheKey);
    if (cached !== undefined) {
      return { authorized: cached, role: null } as const;
    }

    const { isSiteAdmin, workspaceRole } = yield* Effect.all({
      isSiteAdmin: Effect.promise(() =>
        fetchQuery(
          api.auth.getIsSiteAdmin,
          {},
          { token: session.accessToken },
        ),
      ),
      workspaceRole: Effect.promise(() =>
        fetchQuery(
          api.workspaceToUser.getUserRole,
          { slug },
          { token: session.accessToken },
        ),
      ),
    });

    if (slug === "internal") {
      permissionCache.set(cacheKey, isSiteAdmin);
      return { authorized: isSiteAdmin, role: "admin" } as const;
    }

    if (workspaceRole !== null) {
      permissionCache.set(cacheKey, true);
      return { authorized: true, role: workspaceRole } as const;
    }

    permissionCache.set(cacheKey, false);
    return { authorized: false, role: null } as const;
  });

export async function hasWorkspaceAccess(slug: string) {
  const result = await tryCatch(Effect.runPromise(genForSlug(slug)));
  return result;
}
export async function assertWorkspaceAccess(slug: string) {
  const result = await tryCatch(Effect.runPromise(genForSlug(slug)));

  if (!result.data?.authorized) {
    notFound();
  }

  return result.data;
}
