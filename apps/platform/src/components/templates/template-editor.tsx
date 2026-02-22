"use client";

import type {
  Connection,
  Edge,
  Node,
  NodeMouseHandler,
  NodeTypes,
} from "@xyflow/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";
import { Button } from "@amaxa/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@amaxa/ui/card";
import { Input } from "@amaxa/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amaxa/ui/select";
import { Textarea } from "@amaxa/ui/textarea";

import type { TemplateTaskNodeData } from "./template-task-node";
import { TemplateTaskNode } from "./template-task-node";

type TemplateTaskStatus = "todo" | "in_progress" | "completed" | "blocked";
type TemplateTaskPriority = "low" | "medium" | "high";

const taskStatusOptions: { label: string; value: TemplateTaskStatus }[] = [
  { label: "To Do", value: "todo" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Blocked", value: "blocked" },
];

const taskPriorityOptions: {
  label: string;
  value: TemplateTaskPriority;
}[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const nodeTypes: NodeTypes = {
  templateTask: TemplateTaskNode,
};

export function TemplateEditor({
  templateId,
}: {
  templateId: Id<"projectTemplates">;
}) {
  const templateTasks = useQuery(api.templateTasks.listForTemplate, {
    templateId,
  });

  const createTask = useMutation(api.templateTasks.create);
  const updateTask = useMutation(api.templateTasks.update);
  const updateTaskPosition = useMutation(api.templateTasks.updatePosition);
  const removeTask = useMutation(api.templateTasks.remove);
  const addDependency = useMutation(api.templateTasks.addDependency);
  const removeDependency = useMutation(api.templateTasks.removeDependency);

  const [selectedTaskId, setSelectedTaskId] =
    useState<Id<"templateTasks"> | null>(null);
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TemplateTaskStatus>("todo");
  const [priority, setPriority] = useState<TemplateTaskPriority>("medium");
  const [isSaving, setIsSaving] = useState(false);

  const nodesFromTasks = useMemo<Node[]>(
    () =>
      (templateTasks ?? []).map((task) => {
        const taskNodeData: TemplateTaskNodeData = {
          label: task.label,
          status: task.status,
          priority: task.priority,
        };

        if (task.description !== undefined) {
          taskNodeData.description = task.description;
        }

        return {
          id: task._id,
          type: "templateTask",
          position: task.position,
          data: taskNodeData,
        };
      }),
    [templateTasks],
  );

  const edgesFromTasks = useMemo<Edge[]>(() => {
    const edges: Edge[] = [];

    for (const task of templateTasks ?? []) {
      for (const dependency of task.dependencies) {
        edges.push({
          id: `${dependency}->${task._id}`,
          source: dependency,
          target: task._id,
          type: "smoothstep",
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        });
      }
    }

    return edges;
  }, [templateTasks]);

  const [nodes, setNodes, onNodesChange] = useNodesState(nodesFromTasks);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesFromTasks);

  useEffect(() => {
    setNodes(nodesFromTasks);
  }, [nodesFromTasks, setNodes]);

  useEffect(() => {
    setEdges(edgesFromTasks);
  }, [edgesFromTasks, setEdges]);

  const selectedTask = useMemo(
    () =>
      (templateTasks ?? []).find((task) => task._id === selectedTaskId) ?? null,
    [templateTasks, selectedTaskId],
  );

  useEffect(() => {
    if (!selectedTask) {
      setLabel("");
      setDescription("");
      setStatus("todo");
      setPriority("medium");
      return;
    }

    setLabel(selectedTask.label);
    setDescription(selectedTask.description ?? "");
    setStatus(selectedTask.status);
    setPriority(selectedTask.priority);
  }, [selectedTask]);

  const handleNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    setSelectedTaskId(node.id as Id<"templateTasks">);
  }, []);

  const handleAddTask = useCallback(async () => {
    try {
      await createTask({
        templateId,
        label: "New Task",
        status: "todo",
        priority: "medium",
        position: {
          x: 120 + Math.round(Math.random() * 200),
          y: 120 + Math.round(Math.random() * 160),
        },
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create task",
      );
    }
  }, [createTask, templateId]);

  const handleConnect = useCallback(
    async (connection: Connection) => {
      if (!connection.source || !connection.target) {
        return;
      }

      try {
        await addDependency({
          sourceTaskId: connection.source as Id<"templateTasks">,
          targetTaskId: connection.target as Id<"templateTasks">,
        });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to add dependency",
        );
      }
    },
    [addDependency],
  );

  const handleEdgeDelete = useCallback(
    async (edgesToDelete: Edge[]) => {
      const results = await Promise.allSettled(
        edgesToDelete.map((edge) =>
          removeDependency({
            sourceTaskId: edge.source as Id<"templateTasks">,
            targetTaskId: edge.target as Id<"templateTasks">,
          }),
        ),
      );

      const failed = results.find(
        (result): result is PromiseRejectedResult => result.status === "rejected",
      );
      if (failed) {
        const reason: unknown = failed.reason;
        toast.error(
          reason instanceof Error ? reason.message : "Failed to remove dependency",
        );
      }
    },
    [removeDependency],
  );

  const handleNodeDragStop: NodeMouseHandler = useCallback((_event, node) => {
    void updateTaskPosition({
      templateTaskId: node.id as Id<"templateTasks">,
      position: node.position,
    }).catch((error: unknown) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update position",
      );
    });
  }, [updateTaskPosition]);

  const handleSaveTask = useCallback(async () => {
    if (!selectedTaskId) {
      return;
    }

    setIsSaving(true);
    try {
      const payload: {
        templateTaskId: Id<"templateTasks">;
        label: string;
        status: TemplateTaskStatus;
        priority: TemplateTaskPriority;
        description?: string;
      } = {
        templateTaskId: selectedTaskId,
        label: label.trim(),
        status,
        priority,
      };

      const normalizedDescription = description.trim();
      if (normalizedDescription !== "") {
        payload.description = normalizedDescription;
      }

      await updateTask(payload);
      toast.success("Template task updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update task",
      );
    } finally {
      setIsSaving(false);
    }
  }, [description, label, priority, selectedTaskId, status, updateTask]);

  const handleDeleteTask = useCallback(async () => {
    if (!selectedTaskId) {
      return;
    }

    try {
      await removeTask({
        templateTaskId: selectedTaskId,
      });
      setSelectedTaskId(null);
      toast.success("Template task deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete task",
      );
    }
  }, [removeTask, selectedTaskId]);

  if (templateTasks === undefined) {
    return (
      <Card>
        <CardContent className="text-muted-foreground py-12 text-center text-sm">
          Loading template editor...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <Card className="overflow-hidden">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Template Flow</CardTitle>
          <Button onClick={() => void handleAddTask()} size="sm">
            <IconPlus className="size-4" />
            Add Task
          </Button>
        </CardHeader>
        <CardContent className="h-[70vh] p-0">
          <ReactFlowProvider>
            <ReactFlow
              edges={edges}
              fitView
              nodes={nodes}
              nodeTypes={nodeTypes}
              onConnect={(connection) => void handleConnect(connection)}
              onEdgesChange={onEdgesChange}
              onEdgesDelete={(edgesToDelete) =>
                void handleEdgeDelete(edgesToDelete)
              }
              onNodeClick={handleNodeClick}
              onNodeDragStop={(event, node) =>
                void handleNodeDragStop(event, node)
              }
              onNodesChange={onNodesChange}
            >
              <Background />
              <MiniMap />
              <Controls />
            </ReactFlow>
          </ReactFlowProvider>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedTask ? (
            <p className="text-muted-foreground text-sm">
              Select a task to edit its details.
            </p>
          ) : (
            <>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium"
                  htmlFor="template-task-label"
                >
                  Label
                </label>
                <Input
                  id="template-task-label"
                  onChange={(event) => setLabel(event.target.value)}
                  value={label}
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium"
                  htmlFor="template-task-description"
                >
                  Description
                </label>
                <Textarea
                  id="template-task-description"
                  onChange={(event) => setDescription(event.target.value)}
                  rows={4}
                  value={description}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  onValueChange={(value: TemplateTaskStatus | null) => {
                    if (value) {
                      setStatus(value);
                    }
                  }}
                  value={status}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {taskStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select
                  onValueChange={(value: TemplateTaskPriority | null) => {
                    if (value) {
                      setPriority(value);
                    }
                  }}
                  value={priority}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {taskPriorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  isLoading={isSaving}
                  onClick={() => void handleSaveTask()}
                  size="sm"
                >
                  Save
                </Button>
                <Button
                  onClick={() => void handleDeleteTask()}
                  size="sm"
                  variant="destructive"
                >
                  <IconTrash className="size-4" />
                  Delete
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
