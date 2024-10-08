import { Suspense } from "react";

import { ProjectDashboard } from "./_components/ChartData";

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default function HomePage({ params }: ProjectPageProps) {
  const id = params.id;
  return (
    <Suspense fallback="loading">
      <ProjectDashboard id={id} />;
    </Suspense>
  );
}
