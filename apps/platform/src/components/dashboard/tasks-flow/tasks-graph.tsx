"use client";

import {
  Background,
  type Connection,
  Controls,
  type Edge,
  MarkerType,
  MiniMap,
  type Node,
  type NodeMouseHandler,
  type NodeTypes,
  type OnEdgesChange,
  type OnNodesChange,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import { memo, useEffect, useMemo } from "react";
import { TaskNode } from "@/components/dashboard/sidebar/TaskNode";

const nodeTypes: NodeTypes = {
  task: TaskNode,
  default: TaskNode,
};

const defaultEdgeOptions = {
  type: "smoothstep",
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
  },
};

export interface TasksGraphProps {
  nodes: Node[];
  edges: Edge[];
  onConnect: (connection: Connection) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onNodeDragStop: NodeMouseHandler;
  onPaneContextMenu: (event: MouseEvent | React.MouseEvent) => void;
  onNodeContextMenu: NodeMouseHandler;
  onEdgeContextMenu: (event: MouseEvent | React.MouseEvent, edge: Edge) => void;
  onFlowInstanceReady?: (instance: ReturnType<typeof useReactFlow>) => void;
}

const TasksGraphInner = memo(function TasksGraphInner({
  nodes,
  edges,
  onConnect,
  onNodesChange,
  onEdgesChange,
  onNodeDragStop,
  onPaneContextMenu,
  onNodeContextMenu,
  onEdgeContextMenu,
  onFlowInstanceReady,
}: TasksGraphProps) {
  const reactFlowInstance = useReactFlow();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only run once when reactFlowInstance becomes available
  useEffect(() => {
    if (onFlowInstanceReady && reactFlowInstance) {
      onFlowInstanceReady(reactFlowInstance);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reactFlowInstance]);

  const layoutStyle = useMemo(
    () => ({
      flex: 1,
      width: "100%",
      height: "100%",
      backgroundColor: "#ffffff",
    }),
    []
  );
  const fitViewOptions = useMemo(() => ({ padding: 0.2 }), []);
  const proOptions = useMemo(() => ({ hideAttribution: true }), []);
  const snapGrid = useMemo(() => [15, 15] as [number, number], []);

  return (
    <div style={layoutStyle}>
      <ReactFlow
        colorMode="dark"
        defaultEdgeOptions={defaultEdgeOptions}
        edges={edges}
        fitView
        fitViewOptions={fitViewOptions}
        nodes={nodes}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onEdgeContextMenu={onEdgeContextMenu}
        onEdgesChange={onEdgesChange}
        onlyRenderVisibleElements
        onNodeContextMenu={onNodeContextMenu}
        onNodeDragStop={onNodeDragStop}
        onNodesChange={onNodesChange}
        onPaneContextMenu={onPaneContextMenu}
        proOptions={proOptions}
        snapGrid={snapGrid}
        snapToGrid
        zoomOnScroll={true}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
});

export const TasksGraph = memo(function TasksGraph(props: TasksGraphProps) {
  return (
    <ReactFlowProvider>
      <TasksGraphInner {...props} />
    </ReactFlowProvider>
  );
});
