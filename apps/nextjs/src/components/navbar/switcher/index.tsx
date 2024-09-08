import React, { cache } from "react";

import { eq } from "@amaxa/db";
import { db } from "@amaxa/db/client";
import { project_tracker, Projects } from "@amaxa/db/schema";

import { checkAuth } from "~/lib/auth";
import { TeamSwitcherClient } from "./team-switcher-client";

// Function to get user's projects for TeamSwitcher
export const getUserProjects = cache(async (userId: string) => {
  return await db
    .select({
      id: Projects.id,
      name: Projects.name,
      image: Projects.image,
    })
    .from(project_tracker)
    .where(eq(project_tracker.userId, userId))
    .innerJoin(Projects, eq(Projects.id, project_tracker.projectId));
});

export const TeamSwitcher = async () => {
  const session = await checkAuth();

  const projects = await getUserProjects(session.user.id);

  return <TeamSwitcherClient projects={projects} />;
};
