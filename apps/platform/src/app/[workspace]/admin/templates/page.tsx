import { requireSiteAdmin } from "@/lib/auth/dal";
import { preloadQuery } from "convex/nextjs";

import { api } from "@amaxa/backend/_generated/api";

import { WorkspaceTemplatesClient } from "./client";

export default async function WorkspaceTemplatesPage({
  params,
}: {
  params: Promise<{ workspace: string }>;
}) {
  const [{ workspace: workspaceSlug }, { accessToken }] = await Promise.all([
    params,
    requireSiteAdmin(),
  ]);

  const [preloadedWorkspaceTemplates, preloadedGlobalTemplates] =
    await Promise.all([
      preloadQuery(
        api.projectTemplates.listForWorkspace,
        { workspaceSlug },
        { token: accessToken },
      ),
      preloadQuery(api.projectTemplates.listGlobal, {}, { token: accessToken }),
    ]);

  return (
    <WorkspaceTemplatesClient
      preloadedGlobalTemplates={preloadedGlobalTemplates}
      preloadedWorkspaceTemplates={preloadedWorkspaceTemplates}
      workspaceSlug={workspaceSlug}
    />
  );
}
