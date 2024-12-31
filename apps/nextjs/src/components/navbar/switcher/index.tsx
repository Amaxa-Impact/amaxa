import React from "react";

import { eq } from "@amaxa/db";
import { db } from "@amaxa/db/client";
import { Project_Tracker, Projects } from "@amaxa/db/schema";

import { checkAuth } from "~/lib/auth";
import { next_cache } from "~/lib/cache";
import { TeamSwitcherClient } from "./team-switcher-client";

export const getUserProjects = next_cache(
  (userId: string) =>
    db
      .select({
        id: Projects.id,
        name: Projects.name,
        image: Projects.image,
      })
      .from(Project_Tracker)
      .where(eq(Project_Tracker.userId, userId))
      .innerJoin(Projects, eq(Projects.id, Project_Tracker.projectId)),
  ["getUserProjects"],
);

export const TeamSwitcher = async () => {
  const session = await checkAuth();
  const projects = await getUserProjects(session.user.id);

  return <TeamSwitcherClient projects={projects} />;
};
