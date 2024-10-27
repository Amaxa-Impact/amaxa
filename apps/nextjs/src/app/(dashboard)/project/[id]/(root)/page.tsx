import { Suspense } from "react";

import { api, HydrateClient } from "~/trpc/server";
import { ProjectDashboard } from "./_components/ChartData";

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function HomePage({ params }: ProjectPageProps) {
  const id = (await params).id;

  void api.tasks.getTasksOverTime.prefetch({
    projectId: id,
  });

  void api.tasks.getTaskPriorities.prefetch({
    projectId: id,
  });

  void api.tasks.getTaskStatuses.prefetch({
    projectId: id,
  });

  return (
    <HydrateClient>
      <Suspense fallback="loading">
        <ProjectDashboard id={id} />;
      </Suspense>
    </HydrateClient>
  );
}
