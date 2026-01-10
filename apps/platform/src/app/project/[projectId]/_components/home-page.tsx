"use client";
import type { User } from "@workos-inc/node";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { useDashboardContext } from "@/components/dashboard/context";
import { TaskStatusChart } from "@/components/dashboard/task-status-chart";
import { TasksTable } from "@/components/dashboard/tasks-table";
import type { api } from "@/convex/_generated/api";

export function HomePage({
  allUsers,
  statusCountsPrefetched,
}: {
  allUsers: User[];
  statusCountsPrefetched: Preloaded<typeof api.dashboard.getTaskStatusCounts>;
}) {
  const { project } = useDashboardContext();

  const statusCounts = usePreloadedQuery(statusCountsPrefetched);

  return (
    <div className="flex flex-col gap-6 bg-background p-6">
      <div>
        <h1 className="font-bold text-3xl">{project.name}</h1>
        <p className="text-muted-foreground">Project Dashboard</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TaskStatusChart
          data={statusCounts?.allTasks}
          description="Task breakdown by status"
          title="All Tasks"
          total={statusCounts?.totalAll}
        />
        <TaskStatusChart
          data={statusCounts?.userTasks}
          description="Your assigned tasks by status"
          title="My Tasks"
          total={statusCounts?.totalUser}
        />
      </div>

      <TasksTable allUsers={allUsers} projectId={project.id} />
    </div>
  );
}
