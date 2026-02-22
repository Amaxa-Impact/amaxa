import type { Metadata } from "next";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { fetchQuery, preloadQuery } from "convex/nextjs";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";

import { HomePage } from "./_components/home-page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    projectId: Id<"projects">;
  }>;
}): Promise<Metadata> {
  const [{ projectId }, { accessToken }] = await Promise.all([
    params,
    withAuth(),
  ]);

  if (!accessToken) {
    return {
      title: "Project Dashboard",
      description: "View project dashboard and task overview",
    };
  }

  try {
    const project = await fetchQuery(
      api.projects.get,
      { projectId },
      { token: accessToken },
    );

    return {
      title: `${project.name} - Dashboard`,
      description: `Dashboard for ${project.name}. ${project.description}`,
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
  const [{ projectId }, { accessToken }] = await Promise.all([
    params,
    withAuth(),
  ]);
  if (!accessToken) {
    return null;
  }
  const preloadedData = await preloadQuery(
    api.dashboard.getTaskStatusCounts,
    { projectId },
    {
      token: accessToken,
    },
  );

  return <HomePage statusCountsPrefetched={preloadedData} />;
}
