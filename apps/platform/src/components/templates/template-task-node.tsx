"use client";

import type { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

type TemplateTaskStatus = "todo" | "in_progress" | "completed" | "blocked";
type TemplateTaskPriority = "low" | "medium" | "high";

export interface TemplateTaskNodeData extends Record<string, unknown> {
  label: string;
  description?: string;
  status: TemplateTaskStatus;
  priority: TemplateTaskPriority;
}

const statusStyles: Record<TemplateTaskStatus, string> = {
  todo: "bg-slate-100 text-slate-700 border-slate-200",
  in_progress: "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  blocked: "bg-rose-100 text-rose-700 border-rose-200",
};

const priorityStyles: Record<TemplateTaskPriority, string> = {
  low: "text-slate-500",
  medium: "text-amber-600",
  high: "text-rose-600",
};

export const TemplateTaskNode = memo(({ data }: NodeProps) => {
  const taskData = data as unknown as TemplateTaskNodeData;

  return (
    <div className="bg-card text-card-foreground min-w-56 rounded-lg border px-3 py-2 shadow-sm">
      <Handle className="size-3" position={Position.Left} type="target" />

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm font-semibold">{taskData.label}</p>
          <span
            className={`rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase ${statusStyles[taskData.status]}`}
          >
            {taskData.status.replace("_", " ")}
          </span>
        </div>

        {taskData.description ? (
          <p className="text-muted-foreground line-clamp-2 text-xs">
            {taskData.description}
          </p>
        ) : null}

        <p
          className={`text-[11px] font-medium uppercase ${priorityStyles[taskData.priority]}`}
        >
          {taskData.priority} priority
        </p>
      </div>

      <Handle className="size-3" position={Position.Right} type="source" />
    </div>
  );
});

TemplateTaskNode.displayName = "TemplateTaskNode";
