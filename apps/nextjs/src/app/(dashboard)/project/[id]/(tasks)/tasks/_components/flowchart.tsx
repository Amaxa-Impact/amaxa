/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { Edge, NodeTypes } from "@xyflow/react";
import React, { useCallback, useEffect, useRef, useTransition } from "react";
import { Controls, MiniMap, ReactFlow, useReactFlow } from "@xyflow/react";
import { LoaderCircle } from "lucide-react";

import "@xyflow/react/dist/style.css";

import Link from "next/link";
import { useParams } from "next/navigation";
import { createId } from "@paralleldrive/cuid2";

import { Button, buttonVariants } from "@amaxa/ui/button";

import type { NodeType } from "~/lib/types/flowcart";
import useStore from "~/lib/store";
import { saveTasks } from "../_actions";
import TaskNode from "./custom-node";

const nodeTypes: NodeTypes = {
  task: TaskNode,
};

interface FlowchartProps {
  tasksInit?: NodeType[];
  edgesInit?: Edge[];
}

export const Flowchart: React.FC<FlowchartProps> = ({
  tasksInit,
  edgesInit,
}) => {
  console.log("tasksInit", tasksInit);
  const [isPending, startTransition] = useTransition();
  const projectId = useParams<{ id: string }>().id;
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setNodes,
    setEdges,
  } = useStore();

  const initializationDone = useRef(false);
  useEffect(() => {
    if (!initializationDone.current) {
      if (tasksInit) {
        console.log("tasksInit", tasksInit);
        setNodes(tasksInit);
      }
      if (edgesInit) {
        console.log("edgesInit", edgesInit);
        setEdges(edgesInit);
      }
      initializationDone.current = true;
    }
  }, [tasksInit, edgesInit, setNodes, setEdges]);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const connectingNodeId = useRef<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onConnectStart = useCallback(
    (_: any, { nodeId }: { nodeId: string | null }) => {
      connectingNodeId.current = nodeId;
    },
    [],
  );

  function handleSubmit() {
    const data = {
      tasks: nodes,
      edges: edges.map((edge) => {
        return {
          ...edge,
          projectId: projectId,
        };
      }),
    };

    startTransition(() => {
      try {
        console.log(JSON.parse(JSON.stringify(data)));

        saveTasks(data).catch((error) => {
          console.error("Error saving tasks:", error);
          alert("Failed to save tasks. Please try again.");
        });
      } catch (error) {
        console.error("Invalid data structure:", error);
        alert("There was an error preparing the data. Please try again.");
      }
    });
  }

  const onConnectEnd = useCallback(
    (event: any) => {
      if (!connectingNodeId.current) return;
      const targetIsPane = (event.target as Element).classList.contains(
        "react-flow__pane",
      );
      if (targetIsPane) {
        const id = createId();
        const newNode: NodeType = {
          id,
          type: "task",
          parentId: connectingNodeId.current,
          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          data: {
            id,
            title: `New Task`,
            status: "todo",
            description: "",
            assigne: {
              id: "unassigned",
              name: "Unassigned",
              image:
                "https://png.pngtree.com/png-vector/20230407/ourmid/pngtree-operational-system-line-icon-vector-png-image_6691165.png",
            },
            assigneName: "Unassigned",
            projectId: projectId,
            parent: { id: connectingNodeId.current },
            doneBy: new Date(),
          },
        };
        setNodes([...nodes, newNode]);
        setEdges([
          ...edges,
          {
            id: `e${connectingNodeId.current}-${id}`,
            source: connectingNodeId.current,
            target: id,
          },
        ]);
      }
      connectingNodeId.current = null;
    },
    [screenToFlowPosition, projectId, setNodes, setEdges, nodes, edges],
  );

  return (
    <div style={{ width: "100%", height: "100vh" }} ref={reactFlowWrapper}>
      <div className="flex flex-row justify-between px-6 pt-2">
        <div className="flex gap-3">
          <Button
            onClick={handleSubmit}
            variant={"primary"}
            disabled={isPending}
          >
            Save
            {isPending && <LoaderCircle className="animate-spin" />}
          </Button>
          <Link
            href={`/project/${projectId}/`}
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Back
          </Link>
        </div>
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
