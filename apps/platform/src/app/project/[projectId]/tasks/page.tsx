import type { Metadata } from "next";
import { TasksFlowContent } from "@/components/dashboard/tasks-flow/tasks-flow-content";
import { listUsers } from "@/lib/workos";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { fetchQuery } from "convex/nextjs";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    projectId: Id<"projects">;
  }>;
}): Promise<Metadata> {
  const { projectId } = await params;
  const { accessToken } = await withAuth();

  try {
    const project = await fetchQuery(
      api.projects.get,
      { projectId },
      { token: accessToken },
    );

    if (!project) {
      return {
        title: "Tasks",
        description: "Manage and view project tasks",
      };
    }

    return {
      title: `Tasks - ${project.name}`,
      description: `Manage and view tasks for ${project.name}`,
    };
  } catch {
    return {
      title: "Tasks",
      description: "Manage and view project tasks",
    };
  }
}

export default async function RouteComponent() {
  const allUsersResult = await listUsers();

  return <TasksFlowContent allUsers={allUsersResult} />;
}
