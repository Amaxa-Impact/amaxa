import type { Edge, Node } from "@xyflow/react";

import { RouterOutputs } from "@amaxa/api";

export type NodeData =
  RouterOutputs["tasks"]["getProjectTasks"]["tasks"][0]["data"];

export type NodeType = Node<NodeData>;

export type EdgeData = RouterOutputs["tasks"]["getProjectTasks"]["edges"][0];

export type EdgeType = Edge<EdgeData>;
