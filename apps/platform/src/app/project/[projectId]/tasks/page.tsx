import { withAuth } from "@workos-inc/authkit-nextjs";
import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { TasksFlowContent } from "@/components/dashboard/tasks-flow/tasks-flow-content";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { listUsers } from "@/lib/workos";

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
      { token: accessToken }
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

export default async function RouteComponent({
  params,
}: {
  params: Promise<{
    projectId: Id<"projects">;
  }>;
}) {
  const allUsers = await listUsers();

  return <TasksFlowContent allUsers={allUsers} />;
}
