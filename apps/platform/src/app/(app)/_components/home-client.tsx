"use client";

import { useQuery } from "convex/react";

import { api } from "@amaxa/backend/_generated/api";

import { InvitationCard } from "./invitation-card";
import { WorkspaceCard } from "./workspace-card";

export function HomeClient() {
  const workspaces = useQuery(api.workspaces.listForUser, {});
  const invitations = useQuery(api.workspaceInvitations.listPendingForUser, {});

  const isLoading = workspaces === undefined || invitations === undefined;

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-6 py-8">
        <div className="animate-pulse">
          <div className="bg-muted mb-8 h-8 w-48 rounded" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-muted h-24 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const hasWorkspaces = workspaces.length > 0;
  const hasInvitations = invitations.length > 0;

  return (
    <div className="container mx-auto max-w-4xl px-6 py-8">
      <h1 className="mb-8 text-2xl font-semibold">Your Workspaces</h1>

      {hasWorkspaces ? (
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map(({ workspace, role }) => (
            <WorkspaceCard
              key={workspace._id}
              workspace={workspace}
              role={role}
            />
          ))}
        </div>
      ) : (
        <EmptyWorkspacesState hasInvitations={hasInvitations} />
      )}

      {hasInvitations && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-medium">Pending Invitations</h2>
          <div className="space-y-3">
            {invitations.map((invitation) => (
              <InvitationCard key={invitation._id} invitation={invitation} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function EmptyWorkspacesState({ hasInvitations }: { hasInvitations: boolean }) {
  return (
    <div className="bg-muted/30 border-border flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
      <div className="text-muted-foreground mb-2 text-4xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      </div>
      <h3 className="mb-1 text-lg font-medium">No workspaces yet</h3>
      <p className="text-muted-foreground text-sm">
        {hasInvitations
          ? "Accept an invitation below to get started"
          : "You'll see your workspaces here once you're added to one"}
      </p>
    </div>
  );
}
