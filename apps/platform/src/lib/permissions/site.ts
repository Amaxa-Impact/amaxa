import { cache } from "react";
import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { Effect } from "effect";
import { LRUCache } from "lru-cache";

import { api } from "@amaxa/backend/_generated/api";

import { verifySession } from "../auth/dal";

type CacheKey = `userId:${string}`;

const permissionCache = new LRUCache<CacheKey, boolean>({
  max: 1_000,
  ttl: 1000 * 60 * 5,
});

export const hasSiteAccess = Effect.gen(function* () {
  const session = yield* Effect.tryPromise({
    try: () => verifySession(),
    catch: () => new Error("Authentication failed"),
  });

  // Use userId for cache key (stable) not accessToken (rotates)
  const cacheKey: CacheKey = `userId:${session.userId}`;

  const cached = permissionCache.get(cacheKey);
  if (cached !== undefined) {
    return { authorized: cached, role: null } as const;
  }

  const isSiteAdmin = yield* Effect.tryPromise({
    try: () =>
      fetchQuery(api.auth.getIsSiteAdmin, {}, { token: session.accessToken }),
    catch: () => new Error("Permission check failed"),
  });

  permissionCache.set(cacheKey, isSiteAdmin);

  if (isSiteAdmin) {
    return true;
  }

  return false;
});

export async function assertSiteAdmin() {
  const authorized = await Effect.runPromise(
    hasSiteAccess.pipe(Effect.catchAll(() => Effect.succeed(false))),
  );

  if (!authorized) {
    redirect("/unauthorized");
  }
}

export const hasSiteAccessAsync = cache(async (): Promise<boolean> => {
  const session = await verifySession();

  // Use userId for cache key (stable) not accessToken (rotates)
  const cacheKey: CacheKey = `userId:${session.userId}`;

  const cached = permissionCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  const isSiteAdmin = await fetchQuery(
    api.auth.getIsSiteAdmin,
    {},
    { token: session.accessToken },
  );

  permissionCache.set(cacheKey, isSiteAdmin);
  return isSiteAdmin;
});
