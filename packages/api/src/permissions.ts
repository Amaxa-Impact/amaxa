import type { Session } from "@amaxa/auth";

export function isProjectStudent(projectId: string, session: Session | null) {
  if (!session) return false;
  if (session.user.role === "Admin") return true;
  const projectPermissions = session.user.project_permissions;
  if (!projectPermissions) return false;
  return (
    projectPermissions[projectId] === "admin" ||
    projectPermissions[projectId] === "coach" ||
    projectPermissions[projectId] === "student"
  );
}

/*
  param projectId: string
  @param session: Session | null
  @returns boolean

  Returns true if the user has admin or coach privileges for the project
*/
export function isProjectPrivileged(
  projectId: string,
  session: Session | null,
) {
  if (!session) return false;
  if (session.user.role === "Admin") return true;
  const projectPermissions = session.user.project_permissions;
  if (!projectPermissions) return false;
  return (
    projectPermissions[projectId] === "admin" ||
    projectPermissions[projectId] === "coach"
  );
}

export function isProjectAdmin(projectId: string, session: Session | null) {
  if (!session) return false;
  if (session.user.role === "Admin") return true;
  const projectPermissions = session.user.project_permissions;
  if (!projectPermissions) return false;
  return projectPermissions[projectId] === "admin";
}

export function isAdmin(session: Session | null) {
  if (!session) return false;
  if (session.user.role === "Admin") return true;
  return false;
}
