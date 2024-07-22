'use client'
import React, { useCallback, useEffect, useRef } from 'react';
import {
  MiniMap,
  Controls,
  NodeTypes,
  ReactFlow,
  useReactFlow,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TaskNode from './custom-node';
import { NodeType } from '~/lib/types/flowcart';
import { createId } from '@paralleldrive/cuid2';
import useStore from '~/lib/store';
import { Button } from '@amaxa/ui/button';
import { useParams } from 'next/navigation';
import { saveTasks } from '../_actions';

const nodeTypes: NodeTypes = {
  task: TaskNode,
};

interface FlowchartProps {
  tasksInit?: NodeType[];
  edgesInit?: Edge[];
}

export const Flowchart: React.FC<FlowchartProps> = ({ tasksInit, edgesInit }) => {
  console.log('tasksInit', tasksInit);
  const [startTransition, isPending] = React.useTransition();
  const id = useParams<{ id: string }>().id;
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setNodes,
    setEdges
  } = useStore();

  const initializationDone = useRef(false);
  useEffect(() => {
    if (!initializationDone.current) {
      if (tasksInit) {
        console.log('tasksInit', tasksInit);
        setNodes(tasksInit);
      }
      if (edgesInit) {
        console.log('edgesInit', edgesInit);
        setEdges(edgesInit);
      }
      initializationDone.current = true;
    }
  }, [tasksInit, edgesInit, setNodes, setEdges]);


  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const connectingNodeId = useRef<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onConnectStart = useCallback((_: any, { nodeId }: { nodeId: string | null }) => {
    connectingNodeId.current = nodeId;
  }, []);

  function handleSubmit() {
    if (!id) {
      console.error("No project id available");
      alert("No project id");
      return;
    }
    if (!nodes || nodes.length === 0) {
      console.error("No nodes available");
      alert("No tasks to save");
      return;
    }


    if (!edges || edges.length === 0) {
      console.warn("No edges available");
      // You may want to decide if this is an error condition or not
    }

    const data = {
      tasks: nodes.map(node => {
        if (!node || !node.id) {
          console.error("Invalid node:", node);
          throw new Error("Invalid node data");
        }
        return node;
      }),
      edges: edges.map((edge) => {
        if (!edge || !edge.id || !edge.source || !edge.target) {
          console.error("Invalid edge:", edge);
          throw new Error("Invalid edge data");
        }
        return {
          ...edge,
          projectId: id
        };
      })
    };

    try {
      console.log(JSON.parse(JSON.stringify(data)));

      saveTasks(data).catch(error => {
        console.error("Error saving tasks:", error);
        alert("Failed to save tasks. Please try again.");
      });
    } catch (error) {
      console.error("Invalid data structure:", error);
      alert("There was an error preparing the data. Please try again.");
      // Handle the error appropriately
    }
  }

  const onConnectEnd = useCallback(
    (event: any) => {
      if (!connectingNodeId.current) return;
      const targetIsPane = (event.target as Element).classList.contains('react-flow__pane');
      if (targetIsPane) {
        const id = createId();
        const newNode: NodeType = {
          id,
          type: 'task',
          parentId: connectingNodeId.current,
          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          data: {
            id,
            title: `New Task`,
            status: 'todo',
            description: '',
            assigne: { id: 'unassigned', name: 'Unassigned', image: "https://png.pngtree.com/png-vector/20230407/ourmid/pngtree-operational-system-line-icon-vector-png-image_6691165.png" },
            assigneName: 'Unassigned',
            projectId: id,
            parent: { id: connectingNodeId.current },
            doneBy: new Date(),
          },
        };
        setNodes([...nodes, newNode]);
        setEdges([...edges, { id: `e${connectingNodeId.current}-${id}`, source: connectingNodeId.current!, target: id }]);
      }
      connectingNodeId.current = null;
    },
    [screenToFlowPosition, setNodes, setEdges, nodes, edges]
  );


  return (
    <div style={{ width: '100%', height: '100vh' }} ref={reactFlowWrapper}>
      <div className='flex flex-row justify-between'>
        <Button onClick={handleSubmit}>
          Save
        </Button>
      </div>
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

