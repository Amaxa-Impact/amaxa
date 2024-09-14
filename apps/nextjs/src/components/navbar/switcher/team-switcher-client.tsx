"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@amaxa/ui/dropdown-menu";

export function TeamSwitcherClient({
  projects,
}: {
  projects: { id: string; name: string; image: string | null }[];
}) {
  const { id: currentProjectId } = useParams();
  const router = useRouter();
  const activeProject =
    projects.find((p) => p.id === currentProjectId) || projects[0];

  function handleProjectChange(project: { id: string; name: string }) {
    router.push(`/project/${project.id}`);
  }

  if (!activeProject) return <Link href="/">Home</Link>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full rounded-md ring-ring hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 data-[state=open]:bg-accent">
        <div className="flex items-center gap-1.5 overflow-hidden px-2 py-1.5 text-left text-sm transition-all">
          <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-primary text-primary-foreground"></div>
          <div className="line-clamp-1 flex-1 pr-2 font-medium">
            {activeProject.name}
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64"
        align="start"
        side="right"
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Projects
        </DropdownMenuLabel>
        {projects.map((project) => (
          <DropdownMenuItem
            key={project.id}
            onClick={() => handleProjectChange(project)}
            className="items-start gap-2 px-1.5"
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-primary-foreground"></div>
              <div className="grid flex-1 leading-tight">
                <div className="line-clamp-1 font-medium">{project.name}</div>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
