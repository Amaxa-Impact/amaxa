import React from "react";

import { projects } from "~/lib/projects";
import { GenericHome } from "../../_sections/project-shell";

export default async function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) {
    return <div>Project not found</div>;
  }
  return (
    <div>
      <GenericHome data={project} />
    </div>
  );
}
