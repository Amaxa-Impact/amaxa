import { api } from "~/trpc/server";
import { ProjectDashboard } from "./_components/ChartData";

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default async function HomePage({ params }: ProjectPageProps) {
  const id = params.id;

  await api.tasks.getTasksOverTime.prefetch({ projectId: id });
  await api.tasks.getTaskPriorities.prefetch({ projectId: id });
  await api.tasks.getTaskStatuses.prefetch({ projectId: id });
  return <ProjectDashboard id={id} />;
}
