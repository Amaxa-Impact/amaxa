"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import ReactFlow, {
  addEdge,
  Controls,
  MiniMap,
  Node,
  OnConnectEnd,
  OnConnectStart,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";

import "reactflow/dist/base.css";

import { toast } from "sonner";

import { Button } from "@amaxa/ui/button";

import { showErrorToast } from "~/lib/handle-error";
import { NodeType } from "~/lib/types/flowcart";
import { api } from "~/trpc/react";
import CustomNode from "./CustomNode";

const nodeTypes = {
  custom: CustomNode,
};

//TODO: Breaks at scale
const Flow = ({
  initNodes,
  initEdges,
  projectId,
}: {
  initNodes: NodeType[];
  initEdges: {
    id: string;
    source: string;
    target: string;
  }[];
  projectId: string;
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const { project } = useReactFlow();
  const connectingNodeId = useRef<string | null>(null);
  let isEnabled = nodes === initNodes || edges === initEdges ? false : true;
  useEffect(() => {
    isEnabled = nodes === initNodes || edges === initEdges ? false : true;
  }, [nodes, edges]);

  const { mutate: save } = api.tasks.save.useMutation({
    onSuccess() {
      toast.success("Saved Succesfuly");
    },
    onError(error) {
      showErrorToast(error);
    },
  });

  const { mutate: create } = api.tasks.create.useMutation({
    onSuccess() {
      toast.success("Created Succesfuly");
    },
    onError(error) {
      showErrorToast(error);
    },
  });

  const onSubmit = () => {
    const formatedEdges = edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      projectId: projectId,
    }));

    save({
      tasks: nodes.map((node) => ({
        ...node.data,
      })),
      edges: formatedEdges,
    });
  };

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const getChildNodePosition = (event: any, parentNode: any) => {
    if (
      !parentNode?.positionAbsolute ||
      !parentNode?.width ||
      !parentNode?.height
    ) {
      return;
    }

    const panePosition = project({
      x: event.clientX,
      y: event.clientY,
    });

    return {
      x: panePosition.x - parentNode.positionAbsolute.x + parentNode.width / 2,
      y: panePosition.y - parentNode.positionAbsolute.y + parentNode.height / 2,
    };
  };

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const targetIsPane = (event.target as Element)?.classList.contains(
        "react-flow__pane",
      );

      if (targetIsPane && connectingNodeId.current) {
        const parentNode = nodes.find(
          (node) => node.id === connectingNodeId.current,
        );

        if (parentNode && event.target instanceof Element) {
          const { top, left } = event.target.getBoundingClientRect();
          const position = {
            x: "clientX" in event ? event.clientX - left : 0,
            y: "clientY" in event ? event.clientY - top : 0,
          };
          addChildNode(parentNode, position);
        }
      }
    },
    [nodes],
  );

  const addChildNode = (parentNode: any, position: any) => {
    const newNode = {
      id: nanoid(),
      type: "custom",
      data: {
        name: "New Task",
        assigne: "",
        endDate: new Date(),
        assigneName: "",
      },
      position,
      parentNode: parentNode.id,
    };

    const newEdge = {
      id: nanoid(),
      source: parentNode.id,
      target: newNode.id,
    };
    setNodes((nodes) => [...nodes, newNode]);
    setEdges((edges) => [...edges, newEdge]);

    create({
      task: {
        id: newNode.id,
        type: newNode.type,
        data: {
          ...newNode.data,
          assigne: String(newNode.data.assigne),
        },
        position: newNode.position,
        parentId: newNode.parentNode,
        projectId: projectId,
      },
      edges: {
        ...newEdge,
        projectId: projectId,
      },
    });
  };

  return (
    <div
      className="flex min-h-full min-w-full flex-col"
      style={{
        height: 900,
        width: 900,
      }}
    >
      <Button onClick={onSubmit}>Save</Button>
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
        className="bg-background"
      >
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Flow;
