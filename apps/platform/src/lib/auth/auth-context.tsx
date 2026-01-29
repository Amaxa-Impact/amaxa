"use client";

import type { ReactNode } from "react";
import { createContext, memo, useContext, useMemo } from "react";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { useQuery } from "convex/react";

import { api } from "@amaxa/backend/_generated/api";

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profilePictureUrl: string | null;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = memo(function AuthProvider({
  children,
}: AuthProviderProps) {
  const { user: workosUser, loading: authLoading } = useAuth();
  const adminStatus = useQuery(api.auth.getIsSiteAdmin, {});

  // Derive stable user object
  const user = useMemo<User | null>(() => {
    if (!workosUser) return null;
    return {
      id: workosUser.id,
      email: workosUser.email,
      firstName: workosUser.firstName ?? null,
      lastName: workosUser.lastName ?? null,
      profilePictureUrl: workosUser.profilePictureUrl ?? null,
    };
  }, [workosUser]);

  // Derive boolean states (per rerender-derived-state rule)
  const isAuthenticated = user !== null;
  const isAdmin = adminStatus === true;
  const isLoading = authLoading || adminStatus === undefined;

  // Stable context value to prevent re-renders
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated,
      isAdmin,
      isLoading,
    }),
    [user, isAuthenticated, isAdmin, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
});

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}

/**
 * Hook for components that only need admin status
 * Returns stable boolean to minimize re-renders
 */
export function useIsAdmin(): boolean {
  const { isAdmin } = useAuthContext();
  return isAdmin;
}

/**
 * Hook for components that need loading state
 */
export function useAuthLoading(): boolean {
  const { isLoading } = useAuthContext();
  return isLoading;
}
