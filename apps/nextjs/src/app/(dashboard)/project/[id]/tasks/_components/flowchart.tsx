'use client'
import React, { useCallback, useRef } from 'react';
import {
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  NodeTypes,
  ReactFlow,
  useReactFlow,
  Node,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TaskNode from './custom-node';
import { NodeType, EdgeType, NodeData } from '~/lib/types/flowcart';
import { createId } from '@paralleldrive/cuid2';

const nodeTypes: NodeTypes = {
  task: TaskNode,
};

interface FlowchartProps {
  tasksInit: NodeType[];
  edgesInit: EdgeType[];
}

const FlowchartContent: React.FC<FlowchartProps> = ({ tasksInit, edgesInit }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(tasksInit);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesInit);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const connectingNodeId = useRef<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: any) => {
      connectingNodeId.current = null;
      setEdges((eds: any) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onConnectStart = useCallback((_: any, { nodeId }: { nodeId: string | null }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event: any) => {
      if (!connectingNodeId.current) return;

      const targetIsPane = (event.target as Element).classList.contains('react-flow__pane');

      if (targetIsPane) {
        const id = createId();
        const newNode: Node<NodeData> = {
          id,
          type: 'task',
          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          data: {
            id,
            title: `New Task`,
            status: 'todo',
            assigne: { id: '', name: 'Unassigned', image: null },
            assigneName: 'Unassigned',
            projectId: '', // You might want to set this based on the current project
            parent: { id: connectingNodeId.current },
            doneBy: new Date(),
          },
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({ id: `e${connectingNodeId.current}-${id}`, source: connectingNodeId.current!, target: id })
        );
      }

      connectingNodeId.current = null;
    },
    [screenToFlowPosition, setNodes, setEdges]
  );

  return (
    <div style={{ width: '100%', height: '100vh' }} ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 2 }}
      >
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export const Flowchart: React.FC<FlowchartProps> = (props) => (
  <ReactFlowProvider>
    <FlowchartContent {...props} />
  </ReactFlowProvider>
);
