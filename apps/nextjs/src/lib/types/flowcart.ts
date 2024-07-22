import {
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';

import { RouterOutputs } from "@amaxa/api";

export type NodeData =
  RouterOutputs["tasks"]["getProjectTasks"]["tasks"][0]["data"];

export type NodeType = Node<NodeData>;

export type AppState = {
  nodes: NodeType[];
  edges: Edge[];
  onNodesChange: OnNodesChange<NodeType>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: NodeType[]) => void;
  setEdges: (edges: Edge[]) => void;
  isDifferent: () => boolean;
  changeNode: (nodeId: string, newData: Partial<NodeData>) => void;
};
