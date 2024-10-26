import React from "react";

import { findAllProjects } from "../_queries";
import { ProjectCard } from "./project-card";

export async function ExploreProjects() {
  const allProjects = await findAllProjects();

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-4xl font-semibold">Explore Projects</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
