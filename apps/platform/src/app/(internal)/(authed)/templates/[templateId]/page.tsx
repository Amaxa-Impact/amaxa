import type { Metadata } from "next";
import { requireSiteAdmin } from "@/lib/auth/dal";

import type { Id } from "@amaxa/backend/_generated/dataModel";

import { TemplateEditorPageClient } from "./client";

export const metadata: Metadata = {
  title: "Template Editor",
  description: "Edit global project templates",
};

export default async function TemplateEditorPage({
  params,
}: {
  params: Promise<{ templateId: Id<"projectTemplates"> }>;
}) {
  const [{ templateId }] = await Promise.all([params, requireSiteAdmin()]);

  return <TemplateEditorPageClient templateId={templateId} />;
}
