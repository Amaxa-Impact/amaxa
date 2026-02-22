import type { Metadata } from "next";
import { requireSiteAdmin } from "@/lib/auth/dal";

import { WorkspaceUsersClient } from "./client";

export const metadata: Metadata = {
  title: "Workspace Users",
  description: "Manage workspace members and invitations",
};

export default async function WorkspaceUsersPage() {
  await requireSiteAdmin();

  return <WorkspaceUsersClient />;
}
