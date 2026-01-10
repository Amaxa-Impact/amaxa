import { withAuth } from "@workos-inc/authkit-nextjs";
import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { listUsers } from "@/lib/workos";
import { UsersPageContent } from "./client";

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
        title: "Project Users",
        description: "Manage project members and their roles",
      };
    }

    return {
      title: `Users - ${project.name}`,
      description: `Manage team members and their roles for ${project.name}`,
    };
  } catch {
    return {
      title: "Project Users",
      description: "Manage project members and their roles",
    };
  }
}

export default async function UsersPage() {
  const allUsers = await listUsers();

  return <UsersPageContent allUsers={allUsers} />;
}
