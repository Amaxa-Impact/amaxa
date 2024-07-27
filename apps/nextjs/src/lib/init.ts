import type { Edge } from "@xyflow/react";
import { createId } from "@paralleldrive/cuid2";

import type { NodeType } from "./types/flowcart";

const rootNodeId = createId();

const initialNodes: NodeType[] = [
  {
    id: rootNodeId,
    data: {
      title: "Set Up Project",
      description: "Create a new project and set it up",
      id: rootNodeId,
      status: "todo",
      assigne: {
        id: "system",
        name: "System",
        image:
          "https://png.pngtree.com/png-vector/20230407/ourmid/pngtree-operational-system-line-icon-vector-png-image_6691165.png",
      },
      assigneName: "System",
      projectId: "w93j0wvj4l5hkhh6550fpnll",
      parent: {
        id: rootNodeId,
      },
      doneBy: new Date(),
    },
    parentId: "",
    position: { x: 0, y: 0 },
    type: "task",
  },
];

const initialEdges: Edge[] = [];

export { initialNodes, initialEdges, rootNodeId };
