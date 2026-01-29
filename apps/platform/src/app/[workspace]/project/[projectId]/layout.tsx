import type { Metadata } from "next";
import { BreadcrumbHeader } from "@/components/dashboard/breadcrumb-header";
import { DashboardProvider } from "@/components/dashboard/context";
import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { fetchQuery } from "convex/nextjs";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";
import { SidebarProvider } from "@amaxa/ui/sidebar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    projectId: Id<"projects">;
  }>;
}): Promise<Metadata> {
  const { projectId } = await params;
  const { accessToken } = await withAuth();
  if (!accessToken) {
    return {
      title: "Project",
      description: "View and manage project details",
    };
  }

  try {
    const project = await fetchQuery(
      api.projects.get,
      { projectId },
      { token: accessToken },
    );

    if (!project) {
      return {
        title: "Project",
        description: "View and manage project details",
      };
    }

    return {
      title: project.name,
      description: project.description || `Project: ${project.name}`,
    };
  } catch {
    return {
      title: "Project",
      description: "View and manage project details",
    };
  }
}

export default async function RouteComponent({
  params,
  children,
}: {
  params: Promise<{
    workspace: string;
    projectId: Id<"projects">;
  }>;
  children: React.ReactNode;
}) {
  const projectId = (await params).projectId;

  return (
    <DashboardProvider projectId={projectId}>
      <SidebarProvider>
        <AppSidebar projectId={projectId} />
        <main className="flex flex-1 flex-col">
          <BreadcrumbHeader />
          <div className="flex-1">{children}</div>
        </main>
      </SidebarProvider>
    </DashboardProvider>
  );
}
