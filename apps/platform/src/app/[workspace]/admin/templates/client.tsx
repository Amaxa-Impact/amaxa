"use client";

import { useWorkspace } from "@/components/workspace/context";

import { AdminContainer } from "../_components/admin-container";

export function WorkspaceTemplatesClient() {
  const { workspace } = useWorkspace();

  return (
    <AdminContainer
      title="Templates"
      description={`Project templates for ${workspace.name}`}
    >
      <div className="border-border bg-muted/30 flex min-h-[200px] items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground text-sm">
          Templates coming soon...
        </p>
      </div>
    </AdminContainer>
  );
}
