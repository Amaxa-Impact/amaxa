"use client";

import type { WorkOsError } from "@/lib/errors";
import type { User } from "@workos-inc/node";
import type { Result } from "better-result";
import type { Preloaded } from "convex/react";
import { useDashboardContext } from "@/components/dashboard/context";
import { TaskStatusChart } from "@/components/dashboard/task-status-chart";
import { TasksTable } from "@/components/dashboard/tasks-table";
import { usePreloadedQuery } from "convex/react";

import type { api } from "@amaxa/backend/_generated/api";

export function HomePage({
  allUsers,
  statusCountsPrefetched,
}: {
  allUsers: Result<User[], WorkOsError>;
  statusCountsPrefetched: Preloaded<typeof api.dashboard.getTaskStatusCounts>;
}) {
  const { project } = useDashboardContext();

  const statusCounts = usePreloadedQuery(statusCountsPrefetched);

  return (
    <div className="bg-background flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="text-muted-foreground">Project Dashboard</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TaskStatusChart
          data={statusCounts.allTasks}
          description="Task breakdown by status"
          title="All Tasks"
          total={statusCounts.totalAll}
        />
        <TaskStatusChart
          data={statusCounts.userTasks}
          description="Your assigned tasks by status"
          title="My Tasks"
          total={statusCounts.totalUser}
        />
      </div>

      <TasksTable allUsers={allUsers} projectId={project.id} />
    </div>
  );
}
