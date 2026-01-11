"use client";

import { IconPlus } from "@tabler/icons-react";

import { Button } from "@amaxa/ui/button";

import type { CursorPresenceData } from "./types";

interface TasksHeaderProps {
  projectName: string;
  othersPresence: { user: string; data: unknown }[];
  userRole: "coach" | "member" | null;
  onAddTask: () => void;
}

export function TasksHeader({
  projectName,
  othersPresence,
  userRole,
  onAddTask,
}: TasksHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b px-6 py-4">
      <h1 className="text-2xl font-bold">{projectName}</h1>
      <div className="flex items-center gap-4">
        {othersPresence?.length ? (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              {othersPresence.length} other
              {othersPresence.length !== 1 ? "s" : ""} here
            </span>
            <div className="flex -space-x-2">
              {othersPresence.slice(0, 5).map((p) => {
                const data = p.data as CursorPresenceData;
                const name = data.name ?? `User ${p.user.slice(0, 4)}`;
                const initials =
                  name
                    .split(" ")
                    .filter(Boolean)
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase() || name.slice(0, 2).toUpperCase();

                return (
                  <div
                    className="border-background flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium text-white"
                    key={p.user}
                    style={{ backgroundColor: data.color || "#3b82f6" }}
                    title={name}
                  >
                    {initials}
                  </div>
                );
              })}
              {othersPresence.length > 5 && (
                <div className="border-background bg-muted flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium">
                  +{othersPresence.length - 5}
                </div>
              )}
            </div>
          </div>
        ) : null}

        {userRole && (
          <Button
            className="px-4 py-2"
            onClick={onAddTask}
            type="button"
            variant="outline"
          >
            <IconPlus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        )}
      </div>
    </div>
  );
}
