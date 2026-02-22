import type { Metadata } from "next";
import { requireSiteAdmin } from "@/lib/auth/dal";

import { WorkspaceSettingsClient } from "./client";

export const metadata: Metadata = {
  title: "Workspace Settings",
  description: "Manage workspace settings",
};

export default async function WorkspaceSettingsPage() {
  await requireSiteAdmin();

  return <WorkspaceSettingsClient />;
}
