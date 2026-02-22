"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { useQuery } from "convex/react";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";

type WorkspaceRole = "owner" | "admin" | "member";

export interface WorkspaceData {
  id: Id<"workspaces">;
  name: string;
  slug: string;
}

interface WorkspaceContextValue {
  workspace: WorkspaceData;
  userRole: WorkspaceRole;
  isLoading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>({
  workspace: {
    id: "" as Id<"workspaces">,
    name: "",
    slug: "",
  },
  userRole: "member",
  isLoading: true,
});

interface WorkspaceProviderProps {
  children: ReactNode;
  slug: string;
}

export function WorkspaceProvider({ children, slug }: WorkspaceProviderProps) {
  const workspaceData = useQuery(api.workspaces.getBySlug, { slug });
  const userRole = useQuery(api.workspaceToUser.getUserRole, { slug });

  const isLoading = workspaceData === undefined || userRole === undefined;

  if (!workspaceData || !userRole) {
    return null;
  }

  const workspace = {
    id: workspaceData._id,
    name: workspaceData.name,
    slug: workspaceData.slug,
  };

  const workspaceRole = userRole;

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        userRole: workspaceRole,
        isLoading,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
