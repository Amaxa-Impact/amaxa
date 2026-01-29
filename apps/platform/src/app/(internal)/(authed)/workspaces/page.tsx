import type { Metadata } from "next";
import { requireSiteAdmin } from "@/lib/auth/dal";
import { preloadQuery } from "convex/nextjs";

import { api } from "@amaxa/backend/_generated/api";

import { WorkspacesPageClient } from "./client";

export const metadata: Metadata = {
  title: "Workspaces",
  description: "Manage workspaces on the Amaxa Platform",
};

export default async function WorkspacesPage() {
  const { accessToken } = await requireSiteAdmin();

  const preloadedWorkspaces = await preloadQuery(
    api.workspaces.listAll,
    {},
    { token: accessToken },
  );

  return (
    <div>
      <WorkspacesPageClient preloadedWorkspaces={preloadedWorkspaces} />
    </div>
  );
}
