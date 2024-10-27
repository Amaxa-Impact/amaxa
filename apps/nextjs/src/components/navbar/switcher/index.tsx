import React from "react";

import { eq } from "@amaxa/db";
import { db } from "@amaxa/db/client";
import { project_tracker, Projects } from "@amaxa/db/schema";

import { checkAuth } from "~/lib/auth";
import { next_cache } from "~/lib/cache";
import { TeamSwitcherClient } from "./team-switcher-client";

export const getUserProjects = next_cache(
  async (userId: string) =>
    await db
      .select({
        id: Projects.id,
        name: Projects.name,
        image: Projects.image,
      })
      .from(project_tracker)
      .where(eq(project_tracker.userId, userId))
      .innerJoin(Projects, eq(Projects.id, project_tracker.projectId)),
  ["getUserProjects"],
  {
    revalidate: 60 * 60 * 10, // 10 hours,
  },
);

export const TeamSwitcher = async () => {
  const session = await checkAuth();

  const projects = await getUserProjects(session.user.id);

  return <TeamSwitcherClient projects={projects} />;
};
