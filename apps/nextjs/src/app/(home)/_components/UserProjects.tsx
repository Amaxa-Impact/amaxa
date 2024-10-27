import React from "react";

import { getUserProjects } from "~/components/navbar/switcher";
import { checkAuth } from "~/lib/auth";
import { CreateProject } from "../_components/create-project-dialog";
import { ProjectCard } from "./project-card";

export async function UserProjects() {
  const session = await checkAuth();
  const usersProjects = await getUserProjects(session.user.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row justify-between gap-6">
        <h3 className="text-4xl font-semibold">Your Projects</h3>
        {session.user.role === "Admin" ? <CreateProject /> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {session.user.status === "Pending" ? (
          <ProjectCard
            message="Your account is pending approval, please wait for the admin to approve your account"
            isPending={true}
          />
        ) : session.user.status === "Unverified" ? (
          <ProjectCard
            message="Your account is unverified, please wait till we verify your account to access the platform"
            isPending={true}
          />
        ) : (
          usersProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>
    </div>
  );
}
