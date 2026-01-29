import { AdminProjectsClient } from "./client";

interface AdminProjectsPageProps {
  params: Promise<{ workspace: string }>;
}

export default async function AdminProjectsPage({
  params,
}: AdminProjectsPageProps) {
  const { workspace: workspaceSlug } = await params;

  return <AdminProjectsClient workspaceSlug={workspaceSlug} />;
}
