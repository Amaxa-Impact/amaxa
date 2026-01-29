import { requireSiteAdmin } from "@/lib/auth/dal";

import { WorkspaceTemplatesClient } from "./client";

export default async function WorkspaceTemplatesPage() {
  await requireSiteAdmin();

  return <WorkspaceTemplatesClient />;
}
