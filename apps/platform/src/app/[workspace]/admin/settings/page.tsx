import type { Metadata } from "next";
import { requireSiteAdmin, verifySession } from "@/lib/auth/dal";

import { WorkspaceSettingsClient } from "./client";

export const metadata: Metadata = {
  title: "Workspace Settings",
  description: "Manage workspace settings",
};

export default async function WorkspaceSettingsPage() {
  await requireSiteAdmin();
  await verifySession();

  return <WorkspaceSettingsClient />;
}
