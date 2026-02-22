"use client";

import type { TaskNodeData } from "@/components/dashboard/sidebar/TaskNode";
import type {
  Connection,
  Edge,
  Node,
  NodeMouseHandler,
} from "@xyflow/react";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "next/navigation";
import { useDashboardContext } from "@/components/dashboard/context";
import { Cursor } from "@/components/dashboard/cursor";
import { getUserDisplayName } from "@/components/user-dropdown";
import usePresence from "@/hooks/use-presence";
import { omitUndefined } from "@/lib/omit-undefined";
import { useQueryWithStatus } from "@/lib/rich-query";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import {
  addEdge,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import type { UserOption } from "@/components/user-dropdown";
import { api } from "@amaxa/backend/_generated/api";

import type { ContextMenuState, CursorPresenceData } from "./types";
import { TasksContextMenu } from "./tasks-context-menu";
import { TasksGraph } from "./tasks-graph";
import { TasksHeader } from "./tasks-header";
import { getStableUserId, getUserColor } from "./utils";

interface ProjectMember {
  userId: string;
}

interface FlowInstanceBridge {
  screenToFlowPosition: (position: { x: number; y: number }) => {
    x: number;
    y: number;
  };
  flowToScreenPosition: (position: { x: number; y: number }) => {
    x: number;
    y: number;
  };
}

interface TasksCanvasProps {
  initialEdges: Edge[];
  initialNodes: Node[];
  onCreateEdge: (connection: Connection) => Promise<void>;
  onDataChange: (taskId: string, data: Partial<TaskNodeData>) => Promise<void>;
  onEdgeContextMenu: (event: MouseEvent | React.MouseEvent, edge: Edge) => void;
  onFlowInstanceReady: (instance: FlowInstanceBridge) => void;
  onNodeContextMenu: NodeMouseHandler;
  onNodeDragStop: NodeMouseHandler;
  onPaneContextMenu: (event: MouseEvent | React.MouseEvent) => void;
  onStatusChange: (
    taskId: string,
    status: TaskNodeData["status"],
  ) => Promise<void>;
  projectMembers?: { userId: string; name: string }[];
}

function TasksCanvas({
  initialEdges,
  initialNodes,
  onCreateEdge,
  onDataChange,
  onEdgeContextMenu,
  onFlowInstanceReady,
  onNodeContextMenu,
  onNodeDragStop,
  onPaneContextMenu,
  onStatusChange,
  projectMembers,
}: TasksCanvasProps) {
  const [nodes, _setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const nodesForRender = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...(node.data as unknown as TaskNodeData),
          onStatusChange: (status: TaskNodeData["status"]) =>
            void onStatusChange(node.id, status),
          onDataChange: (data: Partial<TaskNodeData>) =>
            void onDataChange(node.id, data),
          projectMembers,
        },
      })),
    [nodes, onDataChange, onStatusChange, projectMembers],
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) {
        return;
      }

      setEdges((existingEdges) => addEdge(connection, existingEdges));
      void onCreateEdge(connection);
    },
    [onCreateEdge, setEdges],
  );

  return (
    <TasksGraph
      edges={edges}
      nodes={nodesForRender}
      onConnect={handleConnect}
      onEdgeContextMenu={onEdgeContextMenu}
      onEdgesChange={onEdgesChange}
      onFlowInstanceReady={(instance) => {
        onFlowInstanceReady({
          screenToFlowPosition: instance.screenToFlowPosition.bind(instance),
          flowToScreenPosition: instance.flowToScreenPosition.bind(instance),
        });
      }}
      onNodeContextMenu={onNodeContextMenu}
      onNodeDragStop={onNodeDragStop}
      onNodesChange={onNodesChange}
      onPaneContextMenu={onPaneContextMenu}
    />
  );
}

export function TasksFlowContent() {
  const { projectId } = useParams<{ projectId: Id<"projects"> }>();
  const { project, userRole } = useDashboardContext();
  const { isAuthenticated } = useConvexAuth();
  const { user } = useAuth();

  const [flowInstance, setFlowInstance] = useState<FlowInstanceBridge | null>(
    null,
  );
  const { data: convexNodes } = useQueryWithStatus(api.tasks.listForProject, {
    projectId,
  });
  const { data: convexEdges } = useQueryWithStatus(api.edges.listForProject, {
    projectId,
  });
  const { data: projectMembersData } = useQueryWithStatus(
    api.userToProjects.listUsersForProject,
    {
      projectId,
    },
  );
  const allUsers = useQuery(api.users.listAll, {}) as UserOption[] | undefined;
  const projectMembers = projectMembersData as ProjectMember[] | undefined;

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

  const initialNodes = useMemo(() => (convexNodes ?? []) as Node[], [convexNodes]);
  const initialEdges = useMemo(() => (convexEdges ?? []) as Edge[], [convexEdges]);

  const graphStateKey = useMemo(
    () =>
      JSON.stringify({
        edges: initialEdges.map((edge) => [edge.id, edge.source, edge.target]),
        nodes: initialNodes.map((node) => [node.id, node.position.x, node.position.y]),
      }),
    [initialEdges, initialNodes],
  );

  const handleCreateEdge = useCallback(
    async (connection: Connection) => {
      if (connection.source && connection.target) {
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
    [createEdge, projectId],
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
      try {
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
      } catch (error) {
        console.error("Failed to create task:", error);
      }
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

  const userNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const user of allUsers ?? []) {
      map.set(user.id, getUserDisplayName(user));
    }
    return map;
  }, [allUsers]);

  const projectMembersForNodes = useMemo(
    () =>
      projectMembers?.map((member) => ({
        userId: member.userId,
        name: userNameById.get(member.userId) ?? member.userId,
      })),
    [projectMembers, userNameById],
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
        onAddTask={() => void addNewTask()}
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
        <TasksCanvas
          key={graphStateKey}
          initialEdges={initialEdges}
          initialNodes={initialNodes}
          onCreateEdge={handleCreateEdge}
          onDataChange={handleDataChange}
          onEdgeContextMenu={handleEdgeContextMenu}
          onFlowInstanceReady={setFlowInstance}
          onNodeContextMenu={handleNodeContextMenu}
          onNodeDragStop={onNodeDragStop}
          onPaneContextMenu={handlePaneContextMenu}
          onStatusChange={handleStatusChange}
          projectMembers={projectMembersForNodes}
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
