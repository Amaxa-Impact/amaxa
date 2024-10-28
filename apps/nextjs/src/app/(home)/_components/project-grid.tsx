import { memo } from "react";

import ProjectCard from "./project-card";

const ProjectGrid = memo(function ProjectGrid({
  projects,
}: {
  projects: {
    id: string;
    name: string;
    image: string | null;
  }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
});

export default ProjectGrid;
