import { withAuth } from "@workos-inc/authkit-nextjs";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { listUsers } from "@/lib/workos";
import { HomePage } from "./_components/home-page";

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
        title: "Project Dashboard",
        description: "View project dashboard and task overview",
      };
    }

    return {
      title: `${project.name} - Dashboard`,
      description: `Dashboard for ${project.name}. ${project.description || "View tasks, status, and project overview."}`,
    };
  } catch {
    return {
      title: "Project Dashboard",
      description: "View project dashboard and task overview",
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{
    projectId: Id<"projects">;
  }>;
}) {
  const projectId = (await params).projectId;

  const { accessToken } = await withAuth();
  const [allUsers, preloadedData] = await Promise.all([
    listUsers(),
    preloadQuery(
      api.dashboard.getTaskStatusCounts,
      { projectId },
      {
        token: accessToken,
      }
    ),
  ]);

  return (
    <HomePage allUsers={allUsers} statusCountsPrefetched={preloadedData} />
  );
}
