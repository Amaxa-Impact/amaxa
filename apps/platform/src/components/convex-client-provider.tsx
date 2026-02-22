"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { env } from "@/env";
import { AuthProvider } from "@/lib/auth/auth-context";
import {
  AuthKitProvider,
  useAccessToken,
  useAuth,
} from "@workos-inc/authkit-nextjs/components";
import {
  ConvexProviderWithAuth,
  ConvexReactClient,
  useMutation,
} from "convex/react";

import { api } from "@amaxa/backend/_generated/api";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [convex] = useState(() => {
    const convexUrl = env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL is not defined");
    }
    return new ConvexReactClient(convexUrl);
  });
  return (
    <AuthKitProvider>
      <ConvexProviderWithAuth client={convex} useAuth={useAuthFromAuthKit}>
        <UserProfileSync />
        <AuthProvider>{children}</AuthProvider>
      </ConvexProviderWithAuth>
    </AuthKitProvider>
  );
}

function UserProfileSync() {
  const { user, loading } = useAuth();
  const upsertUser = useMutation(api.users.upsertFromSession);
  const lastSyncedKey = useRef<string | null>(null);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      lastSyncedKey.current = null;
      return;
    }

    const syncKey = [
      user.id,
      user.email,
      user.firstName ?? "",
      user.lastName ?? "",
      user.profilePictureUrl ?? "",
    ].join(":");

    if (lastSyncedKey.current === syncKey) {
      return;
    }

    lastSyncedKey.current = syncKey;

    void upsertUser({
      authId: user.id,
      email: user.email,
      ...(user.firstName ? { firstName: user.firstName } : {}),
      ...(user.lastName ? { lastName: user.lastName } : {}),
      ...(user.profilePictureUrl
        ? { profilePictureUrl: user.profilePictureUrl }
        : {}),
    }).catch((error) => {
      console.error("Failed to sync user profile:", error);
      lastSyncedKey.current = null;
    });
  }, [loading, user, upsertUser]);

  return null;
}

export function useAuthFromAuthKit() {
  const { user, loading: isLoading } = useAuth();
  const { getAccessToken, refresh } = useAccessToken();

  const isAuthenticated = !!user;

  const fetchAccessToken = useCallback(
    async ({
      forceRefreshToken,
    }: {
      forceRefreshToken?: boolean;
    } = {}): Promise<string | null> => {
      if (!user) {
        return null;
      }

      try {
        if (forceRefreshToken) {
          return (await refresh()) ?? null;
        }

        return (await getAccessToken()) ?? null;
      } catch (error) {
        console.error("Failed to get access token:", error);
        return null;
      }
    },
    [user, refresh, getAccessToken],
  );

  return {
    isLoading,
    isAuthenticated,
    fetchAccessToken,
  };
}
