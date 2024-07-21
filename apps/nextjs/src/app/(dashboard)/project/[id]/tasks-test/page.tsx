"use client";

import { nanoid } from "nanoid";

import { NodeType } from "~/lib/types/flowcart";
import { api } from "~/trpc/react";
import Flow from "./flow";

/// clash teaches your the real world skills to solve extinction

export default function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id: projectId } = params;
  const { data } = api.tasks.getProjectTasks.useQuery({
    projectId: projectId,
  });
  const nodes = data?.tasks || [];
  const edges = data?.edges || [];

  if (nodes?.length === 0 && edges?.length === 0) {
    const id = nanoid();
    const initNodes: NodeType[] = [
      {
        id: id,
        position: { x: 0, y: 0 },
        data: {
          title: "Nothing left",
          assigneName: "system",
          parent: {
            id: "system",
          },
          assigne: {
            image: "system",
            id: "system",
            name: "system",
          },
          projectId: projectId,
          doneBy: new Date(),
        },
      },
    ];

    return (
      <div className="flex h-full w-full flex-col">
        <Flow initNodes={initNodes} initEdges={[]} projectId={projectId} />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <Flow initNodes={nodes} initEdges={edges} projectId={projectId} />
    </div>
  );
}
