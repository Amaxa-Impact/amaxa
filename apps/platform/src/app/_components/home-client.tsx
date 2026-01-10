"use client";

import { type Preloaded, usePreloadedQuery } from "convex/react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { api } from "@/convex/_generated/api";

interface HomeClientProps {
  userId: string | null;
  isAdmin: boolean;
  prefetchProjects: Preloaded<typeof api.projects.listForUser>;
}

export function HomeClient({
  userId,
  isAdmin,
  prefetchProjects,
}: HomeClientProps) {
  const projects = usePreloadedQuery(prefetchProjects);

  if (!userId) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Welcome to Amaxa</CardTitle>
            <CardDescription>
              Please sign in to access your projects
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="mb-2 font-bold text-3xl">Welcome, Admin</h1>
          <p className="text-muted-foreground">
            Manage your platform from the dashboard
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Manage all projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-3xl">
                {projects === undefined ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  projects.length
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
              <CardDescription>Review submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                className="text-primary hover:underline"
                href="/applications"
              >
                View Applications →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (projects === undefined) {
    return (
      <div className="container mx-auto px-6 py-8">
        <h1 className="mb-6 font-bold text-3xl">My Projects</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] w-full items-center justify-center px-6">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>No Projects Yet</CardTitle>
            <CardDescription>
              You haven&apos;t been assigned to any projects yet. Contact your
              coach to get started.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="mb-6 font-bold text-3xl">My Projects</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link href={`/project/${project._id}`} key={project._id}>
            <Card className="h-full cursor-pointer transition-all hover:ring-2 hover:ring-primary">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <Badge
                    variant={project.role === "coach" ? "default" : "secondary"}
                  >
                    {project.role}
                  </Badge>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
