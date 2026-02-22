"use client";

import { createContext, useContext, useMemo } from "react";
import { useQuery } from "convex/react";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@amaxa/ui/card";
import { Skeleton } from "@amaxa/ui/skeleton";

interface Project {
  name: string;
  description: string;
  id: Id<"projects">;
}

export type UserRole = "coach" | "member" | null;

export const DashboardContext = createContext<{
  project: Project;
  userRole: UserRole;
}>({
  project: {
    name: "",
    description: "",
    id: "" as Id<"projects">,
  },
  userRole: null,
});

export const useDashboardContext = () => {
  return useContext(DashboardContext);
};

export const DashboardProvider = ({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: Id<"projects">;
}) => {
  const project = useQuery(api.projects.get, { projectId });
  const userRole = useQuery(api.userToProjects.getUserRole, { projectId });

  const contextValue = useMemo(
    () => ({
      project: project
        ? {
            name: project.name,
            description: project.description,
            id: project._id,
          }
        : { name: "", description: "", id: "" as Id<"projects"> },
      userRole: (userRole ?? null) as UserRole,
    }),
    [project, userRole],
  );

  if (project === undefined) {
    return (
      <div className="bg-background flex flex-col gap-6 p-6">
        <div>
          <Skeleton className="mb-2 h-9 w-64" />
          <Skeleton className="h-5 w-40" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card className="flex flex-col" key={i}>
              <CardHeader className="items-center pb-0">
                <CardTitle>
                  <Skeleton className="h-6 w-32" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="h-4 w-48" />
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <div className="mx-auto flex aspect-square max-h-62.5 items-center justify-center">
                  <Skeleton className="h-50 w-50 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    className="flex items-center justify-between border-b pb-2"
                    key={i}
                  >
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};
