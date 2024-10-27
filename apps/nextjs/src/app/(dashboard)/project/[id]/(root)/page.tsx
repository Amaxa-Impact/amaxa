import { Suspense } from "react";

import {
  TaskPriorityChart,
  TasksOverTimeChart,
  TaskStatusChart,
} from "./_components/ChartData";
import {
  TaskPrioritySkeletonCard,
  TasksOverTimeSkeletonCard,
  TaskStatusSkeletonCard,
} from "./_components/skeletons";

export const experimental_ppr = true;

export default function ProjectDashboard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="max-h-screen px-10">
      <div className="grid grid-rows-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<TasksOverTimeSkeletonCard />}>
          <TasksOverTimeChart params={params} />
        </Suspense>
        <Suspense fallback={<TaskStatusSkeletonCard />}>
          <TaskStatusChart params={params} />
        </Suspense>
        <Suspense fallback={<TaskPrioritySkeletonCard />}>
          <TaskPriorityChart params={params} />
        </Suspense>
      </div>
    </main>
  );
}
