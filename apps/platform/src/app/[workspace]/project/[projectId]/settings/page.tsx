import type { Metadata } from "next";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { fetchQuery } from "convex/nextjs";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";

import SettingsPageClient from "./settings-client";

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
      title: "Project Settings",
      description: "Manage project settings and configuration",
    };
  }

  try {
    const project = await fetchQuery(
      api.projects.get,
      { projectId },
      { token: accessToken },
    );

    return {
      title: `Settings - ${project.name}`,
      description: `Manage settings for ${project.name} project`,
    };
  } catch {
    return {
      title: "Project Settings",
      description: "Manage project settings and configuration",
    };
  }
}

export default function SettingsPage() {
  return <SettingsPageClient />;
}
