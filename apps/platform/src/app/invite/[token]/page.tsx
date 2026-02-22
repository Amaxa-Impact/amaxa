import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSignInUrl, withAuth } from "@workos-inc/authkit-nextjs";
import { fetchQuery } from "convex/nextjs";

import { api } from "@amaxa/backend/_generated/api";

import { InviteAcceptClient } from "./client";

export const metadata: Metadata = {
  title: "Accept Invitation",
  description: "Accept your workspace invitation",
};

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
    const signInUrl = await getSignInUrl();
    const returnUrl = `/invite/${token}`;
    redirect(`${signInUrl}&redirect_uri=${encodeURIComponent(returnUrl)}`);
  }

  return (
    <InviteAcceptClient
      token={token}
      invitation={invitation}
      userEmail={user.email}
    />
  );
}
