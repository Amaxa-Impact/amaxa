/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import type { TaskNodeData } from "@/components/dashboard/sidebar/TaskNode";
import type { UserOption } from "@/components/user-dropdown";
import type { WorkOsError } from "@/lib/errors";
import type { User } from "@workos-inc/node";
import type {
  Connection,
  Edge,
  Node,
  NodeMouseHandler,
  Viewport,
} from "@xyflow/react";
import type { Result } from "better-result";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useDashboardContext } from "@/components/dashboard/context";
import { Cursor } from "@/components/dashboard/cursor";
import { getUserDisplayName } from "@/components/user-dropdown";
import usePresence from "@/hooks/use-presence";
import { omitUndefined } from "@/lib/omit-undefined";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import {
  addEdge,
  useEdgesState,
  useNodesState,
  useOnViewportChange,
} from "@xyflow/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";

import type { ContextMenuState, CursorPresenceData } from "./types";
import { TasksContextMenu } from "./tasks-context-menu";
import { TasksGraph } from "./tasks-graph";
import { TasksHeader } from "./tasks-header";
import { getStableUserId, getUserColor } from "./utils";

export function TasksFlowContent({
  allUsers,
}: {
  allUsers: Result<User[], WorkOsError>;
}) {
  const { projectId } = useParams<{ projectId: Id<"projects"> }>();
  const { project, userRole } = useDashboardContext();
  const { isAuthenticated } = useConvexAuth();
  const { user } = useAuth();

  const [flowInstance, setFlowInstance] = useState<{
    screenToFlowPosition: (position: { x: number; y: number }) => {
      x: number;
      y: number;
    };
    flowToScreenPosition: (position: { x: number; y: number }) => {
      x: number;
      y: number;
    };
  } | null>(null);
  const convexNodes = useQuery(api.tasks.listForProject, { projectId });
  const convexEdges = useQuery(api.edges.listForProject, { projectId });
  const projectMembers = useQuery(api.userToProjects.listUsersForProject, {
    projectId,
  });

  const createTask = useMutation(api.tasks.create);
  const updatePosition = useMutation(api.tasks.updatePosition);
  const updateTaskData = useMutation(api.tasks.updateData);
  const removeTask = useMutation(api.tasks.remove);
  const createEdge = useMutation(api.edges.create);
  const removeEdge = useMutation(api.edges.remove);

  const userIdRef = useRef<string | null>(null);
  userIdRef.current ??= getStableUserId();
  const userId = userIdRef.current;

  const roomId = `project:${projectId}:tasks`;
  const userColor = getUserColor(userId);

  const userName = user?.firstName ?? "";
  const initialPresenceData: CursorPresenceData = useMemo(
    () => ({
      x: 0,
      y: 0,
      name: userName,
      color: userColor,
      emoji: "👤",
    }),
    [userName, userColor],
  );

  const [_myPresenceData, othersPresence, updatePresence] = usePresence(
    roomId,
    userId,
    initialPresenceData,
  );

  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const [_viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });
  useOnViewportChange({
    onChange: setViewport,
  });

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (reactFlowWrapper.current && isAuthenticated && flowInstance) {
        const flowPosition = flowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
        updatePresence({ x: flowPosition.x, y: flowPosition.y });
      }
    },
    [updatePresence, isAuthenticated, flowInstance],
  );

  const initialNodes = useMemo(
    () => (convexNodes ?? []) as Node[],
    [convexNodes],
  );
  const initialEdges = useMemo(
    () => (convexEdges ?? []) as Edge[],
    [convexEdges],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    if (convexNodes) {
      setNodes(convexNodes as Node[]);
    }
  }, [convexNodes, setNodes]);

  useEffect(() => {
    if (convexEdges) {
      setEdges(convexEdges as Edge[]);
    }
  }, [convexEdges, setEdges]);

  const onConnect = useCallback(
    async (connection: Connection) => {
      if (connection.source && connection.target) {
        setEdges((eds) => addEdge(connection, eds));

        await createEdge(
          omitUndefined({
            projectId,
            source: connection.source as Id<"tasks">,
            target: connection.target as Id<"tasks">,
            type: "smoothstep",
            sourceHandle: connection.sourceHandle ?? undefined,
            targetHandle: connection.targetHandle ?? undefined,
          }),
        );
      }
    },
    [setEdges, createEdge, projectId],
  );

  const onNodeDragStop = useCallback(
    async (_event: React.MouseEvent, node: Node) => {
      await updatePosition({
        taskId: node.id as Id<"tasks">,
        position: node.position,
      });
    },
    [updatePosition],
  );

  const handleStatusChange = useCallback(
    async (taskId: string, status: TaskNodeData["status"]) => {
      if (!status) {
        return;
      }
      await updateTaskData({
        taskId: taskId as Id<"tasks">,
        data: { status },
      });
    },
    [updateTaskData],
  );

  const handleDataChange = useCallback(
    async (taskId: string, data: Partial<TaskNodeData>) => {
      await updateTaskData({
        taskId: taskId as Id<"tasks">,
        data,
      });
    },
    [updateTaskData],
  );

  const addNewTask = useCallback(
    async (position?: { x: number; y: number }) => {
      let pos: { x: number; y: number };

      if (position) {
        if (reactFlowWrapper.current && flowInstance) {
          const rect = reactFlowWrapper.current.getBoundingClientRect();
          pos = flowInstance.screenToFlowPosition({
            x: rect.left + position.x,
            y: rect.top + position.y,
          });
        } else {
          pos = position;
        }
      } else {
        pos = {
          x: Math.random() * 400 + 100,
          y: Math.random() * 300 + 100,
        };
      }

      await createTask({
        projectId,
        type: "task",
        position: pos,
        data: {
          label: "New Task",
          status: "todo",
          priority: "medium",
        },
      });
    },
    [createTask, projectId, flowInstance],
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      await removeTask({ taskId: taskId as Id<"tasks"> });
    },
    [removeTask],
  );

  const deleteEdge = useCallback(
    async (edgeId: string) => {
      await removeEdge({ edgeId: edgeId as Id<"edges"> });
    },
    [removeEdge],
  );

  const handlePaneContextMenu = useCallback(
    (event: MouseEvent | React.MouseEvent) => {
      event.preventDefault();
      if (reactFlowWrapper.current) {
        const rect = reactFlowWrapper.current.getBoundingClientRect();
        setContextMenu({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    },
    [],
  );

  const handleNodeContextMenu: NodeMouseHandler = useCallback((event, node) => {
    event.preventDefault();
    if (reactFlowWrapper.current) {
      const rect = reactFlowWrapper.current.getBoundingClientRect();
      setContextMenu({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        nodeId: node.id,
      });
    }
  }, []);

  const handleEdgeContextMenu = useCallback(
    (event: MouseEvent | React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      if (reactFlowWrapper.current) {
        const rect = reactFlowWrapper.current.getBoundingClientRect();
        setContextMenu({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          edgeId: edge.id,
        });
      }
    },
    [],
  );

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const nodesForRender = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        data: {
          ...(n.data as unknown as TaskNodeData),
          onStatusChange: (status: TaskNodeData["status"]) =>
            handleStatusChange(n.id, status),
          onDataChange: (data: Partial<TaskNodeData>) =>
            handleDataChange(n.id, data),
          projectMembers: projectMembers?.map((member) => {
            if (allUsers.status === "ok") {
              const workosUser = allUsers.value.find(
                (u) => u.id === member.userId,
              );
              return {
                userId: member.userId,
                name: workosUser
                  ? getUserDisplayName(workosUser as UserOption)
                  : member.userId,
              };
            }
            return {
              userId: member.userId,
              name: member.userId,
            };
          }),
        },
      })),
    [nodes, handleStatusChange, handleDataChange, projectMembers, allUsers],
  );

  const layoutStyle = useMemo(
    () => ({
      width: "100%",
      height: "100vh",
      display: "flex",
      flexDirection: "column" as const,
    }),
    [],
  );

  const getCursorScreenPosition = (flowX: number, flowY: number) => {
    if (!(reactFlowWrapper.current && flowInstance)) {
      return { x: 0, y: 0 };
    }

    const rect = reactFlowWrapper.current.getBoundingClientRect();

    const screenPosition = flowInstance.flowToScreenPosition({
      x: flowX,
      y: flowY,
    });

    return {
      x: screenPosition.x - rect.left,
      y: screenPosition.y - rect.top,
    };
  };

  return (
    <div style={layoutStyle}>
      <TasksHeader
        onAddTask={() => addNewTask()}
        othersPresence={othersPresence ?? []}
        projectName={project.name || "Project"}
        userRole={userRole}
      />

      <div
        aria-label="Task flow canvas"
        className="relative flex-1"
        onPointerMove={handleMouseMove}
        ref={reactFlowWrapper}
        role="application"
      >
        <TasksGraph
          edges={edges}
          nodes={nodesForRender}
          onConnect={onConnect}
          onEdgeContextMenu={handleEdgeContextMenu}
          onEdgesChange={onEdgesChange}
          onFlowInstanceReady={(instance) => {
            setFlowInstance({
              screenToFlowPosition:
                instance.screenToFlowPosition.bind(instance),
              flowToScreenPosition:
                instance.flowToScreenPosition.bind(instance),
            });
          }}
          onNodeContextMenu={handleNodeContextMenu}
          onNodeDragStop={onNodeDragStop}
          onNodesChange={onNodesChange}
          onPaneContextMenu={handlePaneContextMenu}
        />

        {othersPresence
          ?.filter((p) => {
            const data = p.data as unknown as CursorPresenceData;
            return data.x !== 0 || data.y !== 0;
          })
          .map((presence) => {
            const data = presence.data as unknown as CursorPresenceData;
            const pos = getCursorScreenPosition(data.x, data.y);

            return (
              <Cursor
                color={data.color}
                key={presence.user}
                name={data.name || `User ${presence.user.slice(0, 4)}`}
                x={pos.x}
                y={pos.y}
              />
            );
          })}

        {contextMenu && (
          <TasksContextMenu
            contextMenu={contextMenu}
            onAddTask={addNewTask}
            onClose={closeContextMenu}
            onDeleteEdge={deleteEdge}
            onDeleteTask={deleteTask}
          />
        )}
      </div>
    </div>
  );
}
