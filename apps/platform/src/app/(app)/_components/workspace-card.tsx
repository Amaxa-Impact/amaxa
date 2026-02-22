"use client";

import Link from "next/link";

import type { Doc } from "@amaxa/backend/_generated/dataModel";
import { cn } from "@amaxa/ui";

type WorkspaceRole = "owner" | "admin" | "member";

interface WorkspaceCardProps {
  workspace: Doc<"workspaces">;
  role: WorkspaceRole;
}

const roleBadgeStyles: Record<WorkspaceRole, string> = {
  owner: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  admin: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  member: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export function WorkspaceCard({ workspace, role }: WorkspaceCardProps) {
  const workspaceUrl = `/${workspace.slug}`;

  return (
    <Link
      href={workspaceUrl}
      className="bg-card hover:border-primary border-border group flex flex-col rounded-lg border p-4 transition-colors"
    >
      <div className="mb-2 flex items-start justify-between">
        <h3 className="group-hover:text-primary truncate font-medium transition-colors">
          {workspace.name}
        </h3>
        <span
          className={cn(
            "ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize",
            roleBadgeStyles[role],
          )}
        >
          {role}
        </span>
      </div>
      <p className="text-muted-foreground text-sm">{workspace.slug}</p>
    </Link>
  );
}
