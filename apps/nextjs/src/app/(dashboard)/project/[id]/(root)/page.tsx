import { ProjectDashboard } from "./_components/ChartData";

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default async function HomePage({ params }: ProjectPageProps) {
  const id = params.id;
  return <ProjectDashboard id={id} />;
}
