import { requireSiteAdmin } from "@/lib/auth/dal";

import type { Id } from "@amaxa/backend/_generated/dataModel";

import { WorkspaceTemplateEditorClient } from "./client";

export default async function WorkspaceTemplateEditorPage({
  params,
}: {
  params: Promise<{ workspace: string; templateId: Id<"projectTemplates"> }>;
}) {
  const [{ workspace, templateId }] = await Promise.all([
    params,
    requireSiteAdmin(),
  ]);

  return (
    <WorkspaceTemplateEditorClient
      templateId={templateId}
      workspaceSlug={workspace}
    />
  );
}
