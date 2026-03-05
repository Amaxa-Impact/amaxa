import type { Metadata } from "next";
import {
  getSignInUrl,
  getSignUpUrl,
  withAuth,
} from "@workos-inc/authkit-nextjs";
import { fetchQuery } from "convex/nextjs";

import { api } from "@amaxa/backend/_generated/api";

import { InviteAcceptClient } from "./client";

export const metadata: Metadata = {
  title: "Accept Invitation",
  description: "Accept your workspace invitation",
};

function withRedirectUri(authUrl: string, redirectUri: string): string {
  const separator = authUrl.includes("?") ? "&" : "?";
  return `${authUrl}${separator}redirect_uri=${encodeURIComponent(redirectUri)}`;
}

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const invitation = await fetchQuery(api.workspaceInvitations.getByToken, {
    token,
  });

  if (!invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-md text-center">
          <h1 className="mb-4 text-2xl font-bold">Invalid Invitation</h1>
          <p className="text-muted-foreground">
            This invitation link is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  if (invitation.status !== "pending") {
    if (invitation.status === "expired") {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="mx-auto max-w-md text-center">
            <h1 className="mb-4 text-2xl font-bold">Invitation Expired</h1>
            <p className="text-muted-foreground">
              This invitation has expired. Please ask the workspace admin to
              send a new invitation.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-md text-center">
          <h1 className="mb-4 text-2xl font-bold">Invitation Already Used</h1>
          <p className="text-muted-foreground">
            This invitation has already been{" "}
            {invitation.status === "accepted" ? "accepted" : "revoked"}.
          </p>
        </div>
      </div>
    );
  }

  const { user } = await withAuth();

  if (!user) {
    const returnUrl = `/invite/${token}`;
    const signInUrl = withRedirectUri(await getSignInUrl(), returnUrl);
    const signUpUrl = withRedirectUri(await getSignUpUrl(), returnUrl);

    return (
      <div className="bg-muted/20 flex min-h-screen items-center justify-center p-4">
        <div className="bg-background w-full max-w-md rounded-xl border p-6 shadow-sm">
          <h1 className="text-xl font-semibold">Accept your invitation</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Sign in to join <strong>{invitation.workspaceName}</strong>. If you
            do not have an account yet, create one using
            <strong> {invitation.email}</strong>.
          </p>

          <div className="mt-6 grid gap-3">
            <a
              href={signUpUrl}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition"
            >
              Create account
            </a>
            <a
              href={signInUrl}
              className="hover:bg-muted inline-flex h-9 items-center justify-center rounded-lg border px-3 text-sm font-medium transition"
            >
              Sign in
            </a>
          </div>

          <p className="text-muted-foreground mt-4 text-xs">
            Use the invited email address to accept this invitation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <InviteAcceptClient
      token={token}
      invitation={invitation}
      userEmail={user.email}
    />
  );
}
