/** biome-ignore-all lint/correctness/noChildrenProp: This is a workaround to fix the linting error. */
"use client";

import type { NodeProps } from "@xyflow/react";
import { memo, useCallback, useRef, useState } from "react";
import { IconCheck, IconPencil, IconX } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { Handle, Position } from "@xyflow/react";

import { Button } from "@amaxa/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@amaxa/ui/field";
import { Input } from "@amaxa/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amaxa/ui/select";
import { Textarea } from "@amaxa/ui/textarea";

export interface TaskNodeData {
  label: string;
  description?: string;
  status?: "todo" | "in_progress" | "completed" | "blocked";
  assignedTo?: string;
  dueDate?: number;
  priority?: "low" | "medium" | "high";
  onStatusChange?: (status: TaskNodeData["status"]) => void;
  onDataChange?: (data: Partial<TaskNodeData>) => void;
  projectMembers?: { userId: string; name?: string }[];
}

const statusColors = {
  todo: "bg-card border-border",
  in_progress:
    "bg-blue-50 dark:bg-blue-950 border-blue-400 dark:border-blue-600",
  completed:
    "bg-green-50 dark:bg-green-950 border-green-400 dark:border-green-600",
  blocked: "bg-red-50 dark:bg-red-950 border-red-400 dark:border-red-600",
};

const priorityColors = {
  low: "text-muted-foreground",
  medium: "text-yellow-600 dark:text-yellow-500",
  high: "text-red-600 dark:text-red-500",
};

const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "blocked", label: "Blocked" },
] as const;

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] as const;

export const TaskNode = memo(({ data, id }: NodeProps) => {
  const taskData = data as unknown as TaskNodeData;
  const [isEditing, setIsEditing] = useState(false);
  const labelInputRef = useRef<HTMLInputElement>(null);

  const status = taskData.status ?? "todo";
  const priority = taskData.priority ?? "medium";

  const form = useForm({
    defaultValues: {
      label: taskData.label,
      description: taskData.description ?? "",
      assignedTo: taskData.assignedTo ?? "",
      priority: taskData.priority ?? "medium",
    },
    onSubmit: ({ value }) => {
      if (taskData.onDataChange) {
        taskData.onDataChange({
          label: value.label,
          description: value.description,
          assignedTo: value.assignedTo,
          priority: value.priority,
        });
      }
      setIsEditing(false);
    },
  });

  const handleStatusChange = useCallback(
    (newStatus: string | null) => {
      if (newStatus && taskData.onStatusChange) {
        taskData.onStatusChange(newStatus as TaskNodeData["status"]);
      }
    },
    [taskData],
  );

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    form.setFieldValue("label", taskData.label);
    form.setFieldValue("description", taskData.description ?? "");
    form.setFieldValue("assignedTo", taskData.assignedTo ?? "");
    form.setFieldValue("priority", taskData.priority ?? "medium");
    setIsEditing(true);
    requestAnimationFrame(() => {
      labelInputRef.current?.focus();
    });
  }, [form, taskData]);

  const handleSave = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      void form.handleSubmit();
    },
    [form],
  );

  const handleCancel = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsEditing(false);
      void form.reset();
    },
    [form],
  );

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  }, []);

  if (isEditing) {
    return (
      <div className="nodrag nopan bg-card text-card-foreground min-w-70 rounded-lg border-2 px-3 py-3 shadow-md">
        <Handle className="h-3 w-3" position={Position.Left} type="target" />

        <form onKeyDown={handleKeyDown}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground text-xs font-medium">
                Edit Task
              </span>
              <div className="flex gap-1">
                <Button
                  className="h-6 w-6 p-0"
                  onClick={handleSave}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  <IconCheck className="h-3.5 w-3.5 text-green-600" />
                </Button>
                <Button
                  className="h-6 w-6 p-0"
                  onClick={handleCancel}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  <IconX className="h-3.5 w-3.5 text-red-600" />
                </Button>
              </div>
            </div>

            <FieldGroup>
              <form.Field name="label">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={`task-${id}-label`}>
                      Task Name
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id={`task-${id}-label`}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Task name"
                        ref={labelInputRef}
                        value={field.state.value}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </FieldContent>
                  </Field>
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={`task-${id}-description`}>
                      Description
                    </FieldLabel>
                    <FieldContent>
                      <Textarea
                        className="min-h-15"
                        id={`task-${id}-description`}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Description (optional)"
                        value={field.state.value}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </FieldContent>
                  </Field>
                )}
              </form.Field>

              <div className="nodrag nopan flex gap-2">
                <form.Field name="priority">
                  {(field) => (
                    <Field className="flex-1">
                      <FieldLabel htmlFor={`task-${id}-priority`}>
                        Priority
                      </FieldLabel>
                      <FieldContent>
                        <Select
                          onValueChange={(value) => {
                            if (value != null) {
                              field.handleChange(value);
                            }
                          }}
                          value={field.state.value}
                        >
                          <SelectTrigger
                            className="w-full"
                            id={`task-${id}-priority`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {priorityOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FieldError errors={field.state.meta.errors} />
                      </FieldContent>
                    </Field>
                  )}
                </form.Field>

                <form.Field name="assignedTo">
                  {(field) => {
                    const selectedMember = taskData.projectMembers?.find(
                      (m) => m.userId === field.state.value,
                    );
                    const displayName = field.state.value
                      ? (selectedMember?.name ?? field.state.value)
                      : "Unassigned";

                    return (
                      <Field className="flex-1">
                        <FieldLabel htmlFor={`task-${id}-assignedTo`}>
                          Assigned To
                        </FieldLabel>
                        <FieldContent>
                          <Select
                            onValueChange={(value) =>
                              field.handleChange(value ?? "")
                            }
                            value={field.state.value}
                          >
                            <SelectTrigger
                              className="w-full"
                              id={`task-${id}-assignedTo`}
                            >
                              <SelectValue>{displayName}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Unassigned</SelectItem>
                              {taskData.projectMembers?.map((member) => (
                                <SelectItem
                                  key={member.userId}
                                  value={member.userId}
                                >
                                  {member.name ?? member.userId}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError errors={field.state.meta.errors} />
                        </FieldContent>
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            </FieldGroup>
          </div>
        </form>

        <Handle className="h-3 w-3" position={Position.Right} type="source" />
      </div>
    );
  }

  return (
    <div
      className={`text-foreground min-w-50 rounded-lg border-2 px-3 py-2.5 shadow-md ${statusColors[status]}`}
    >
      <Handle className="h-3 w-3" position={Position.Left} type="target" />

      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="flex-1 text-sm leading-tight font-semibold">
            {taskData.label}
          </h3>
          <div className="flex items-center gap-1">
            <span className={`text-xs font-medium ${priorityColors[priority]}`}>
              {priority.toUpperCase()}
            </span>
            <Button
              className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
              onClick={handleEditClick}
              size="sm"
              variant="ghost"
            >
              <IconPencil className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {taskData.description && (
          <p className="text-muted-foreground line-clamp-2 text-xs">
            {taskData.description}
          </p>
        )}

        <div className="nodrag nopan flex items-center gap-2">
          <Select onValueChange={handleStatusChange} value={status}>
            <SelectTrigger className="h-6 w-full text-xs" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {taskData.assignedTo && (
          <div className="text-muted-foreground text-xs">
            Assigned to:{" "}
            {taskData.projectMembers?.find(
              (m) => m.userId === taskData.assignedTo,
            )?.name ?? taskData.assignedTo}
          </div>
        )}
      </div>

      <Handle className="h-3 w-3" position={Position.Right} type="source" />
    </div>
  );
});

TaskNode.displayName = "TaskNode";
