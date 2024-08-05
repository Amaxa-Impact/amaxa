import { eq, sql } from "drizzle-orm";

import type { ProjectPermission } from "@amaxa/db/schema";
import { db } from "@amaxa/db/client";
import { project_tracker, User } from "@amaxa/db/schema";

const preparedGetUserInfo = db
  .select({
    status: User.status,
    role: User.role,
  })
  .from(User)
  .where(eq(User.id, sql.placeholder("id")))
  .prepare("getUserInfo");

const preparedGetUserProjectTrackers = db
  .select({
    projectId: project_tracker.projectId,
    permission: project_tracker.permission,
    createdAt: project_tracker.createdAt,
  })
  .from(project_tracker)
  .where(eq(project_tracker.userId, sql.placeholder("userId")))
  .prepare("getUserProjectTrackers");

async function getUserInformation(id: string) {
  const userData = await preparedGetUserInfo.execute({ id });
  const user = userData[0] ?? {
    status: "Unverified",
    role: "Student",
  };

  const projectTrackersData = await preparedGetUserProjectTrackers.execute({
    userId: id,
  });

  const project_permissions: Record<string, ProjectPermission> = {};

  for (const tracker of projectTrackersData) {
    project_permissions[tracker.projectId] = tracker.permission;
  }

  return {
    ...user,
    project_permissions,
  };
}

export { getUserInformation };
