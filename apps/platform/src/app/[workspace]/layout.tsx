import type { ReactNode } from "react";
import { WorkspaceProvider } from "@/components/workspace/context";
import { assertWorkspaceAccess } from "@/lib/permissions/workspaces";

import { WorkspaceNavbar } from "./(app)/_components/workspace-navbar";

interface WorkspaceLayoutProps {
  children: ReactNode;
  params: Promise<{ workspace: string }>;
}

export default async function WorkspaceLayout({
  children,
  params,
}: WorkspaceLayoutProps) {
  const { workspace: slug } = await params;
  await assertWorkspaceAccess(slug);

  return <WorkspaceProvider slug={slug}>{children}</WorkspaceProvider>;
}
