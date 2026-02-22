"use client";

import Link from "next/link";
import { useWorkspace } from "@/components/workspace/context";
import { useQuery } from "convex/react";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";
import { Skeleton } from "@amaxa/ui/skeleton";

import { useAuthContext } from "~/lib/auth/auth-context";
import { ProjectCard } from "./_components/project-card";

export default function Page() {
  const { user, isAdmin: isSiteAdmin } = useAuthContext();
  const { workspace, userRole, isLoading } = useWorkspace();

  const isAdmin = isSiteAdmin || userRole === "admin" || userRole === "owner";

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="bg-muted h-16 animate-pulse" />
        <div className="flex-1 p-6">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <AdminView
        workspace={workspace}
        user={user}
        workspaceSlug={workspace.slug}
      />
    );
  }

  return (
    <MemberView
      workspace={workspace}
      user={user}
      workspaceSlug={workspace.slug}
    />
  );
}

function AdminView({
  workspace,
  user,
  workspaceSlug,
}: {
  workspace: { id: Id<"workspaces">; name: string; slug: string };
  user: { id: string; email: string } | null;
  workspaceSlug: string;
}) {
  const projects = useQuery(api.projects.listByWorkspace, {
    workspaceSlug: workspace.slug,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {workspace.name}
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.email ?? "Admin"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-medium">All Projects</h2>
            {!projects ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
              </div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <Link
                    key={project._id}
                    href={`/${workspaceSlug}/project/${project._id}`}
                    className="bg-card hover:border-primary/40 border-border group flex flex-col rounded-lg border p-6 transition-all hover:shadow-lg"
                  >
                    <h3 className="group-hover:text-primary mb-2 text-lg font-semibold transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3 flex-1">
                      {project.description}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyProjectsState />
            )}
          </div>

          <div className="border-border bg-muted/30 rounded-lg border p-8 text-center">
            <p className="text-muted-foreground">
              Manage projects in the{" "}
              <Link
                href="/admin/projects"
                className="text-primary hover:underline"
              >
                Admin Dashboard
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function MemberView({
  workspace,
  user,
  workspaceSlug,
}: {
  workspace: { id: string; name: string; slug: string };
  user: { id: string; email: string } | null;
  workspaceSlug: string;
}) {
  const projects = useQuery(api.projects.listForUser, {});
  const userProjects = projects ?? [];

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-6xl space-y-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {workspace.name}
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.email ?? "User"}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-medium">Your Projects</h2>
            {!projects ? (
              <Skeleton className="h-64" />
            ) : userProjects.length > 0 ? (
              <div className="space-y-6">
                {userProjects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    projectId={project._id}
                    name={project.name}
                    description={project.description}
                    role={project.role}
                    workspaceSlug={workspaceSlug}
                  />
                ))}
              </div>
            ) : (
              <EmptyProjectsState />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function EmptyProjectsState() {
  return (
    <div className="bg-muted/30 border-border flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
      <div className="text-muted-foreground mb-4 text-6xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </svg>
      </div>
      <h3 className="mb-2 text-xl font-semibold">No projects yet</h3>
      <p className="text-muted-foreground max-w-md text-center">
        {`You don't have any projects in this workspace yet. Contact your workspace
        admin to get assigned to a project.`}
      </p>
    </div>
  );
}
