"use client";

import { useWorkspace } from "@/components/workspace/context";

import { AdminContainer } from "../_components/admin-container";
import { ProjectsTable } from "../../(app)/_components/projects-table";

interface AdminProjectsClientProps {
  workspaceSlug: string;
}

export function AdminProjectsClient({
  workspaceSlug,
}: AdminProjectsClientProps) {
  const { workspace } = useWorkspace();

  return (
    <AdminContainer
      title="Projects"
      description={`Manage all projects in ${workspace.name}`}
    >
      <ProjectsTable workspaceId={workspace.id} workspaceSlug={workspaceSlug} />
    </AdminContainer>
  );
}
