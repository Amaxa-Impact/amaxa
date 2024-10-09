import { Suspense } from "react";

import { api, HydrateClient } from "~/trpc/server";
import { ProjectDashboard } from "./_components/ChartData";

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default function HomePage({ params }: ProjectPageProps) {
  const id = params.id;

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
