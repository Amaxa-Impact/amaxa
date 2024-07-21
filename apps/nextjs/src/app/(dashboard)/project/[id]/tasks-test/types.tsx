import { type Node } from "reactflow";

import { RouterOutputs } from "@amaxa/api";

export type NodeData =
  RouterOutputs["tasks"]["getProjectTasks"]["tasks"][0]["data"];

export type NodeType = Node<NodeData>;
