"use client";

import React, { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartArea, House, Settings, User, Workflow } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@amaxa/ui/tooltip";

export const Sidebar = memo(({ id, name }: { id: string; name: string }) => {
  const pathname = usePathname();

  console.log(pathname);
  return (
    <div>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-muted/40 sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
          <Link
            href="/"
            className={`group ${
              pathname === "/"
                ? "text-accent-foreground"
                : "text-muted-foreground"
            } flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold md:h-8 md:w-8 md:text-base`}
          >
            <House className="h-5 w-5" />
            <span className="sr-only">{name}</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/project/${id}/`}
                className={`flex h-9 w-9 items-center justify-center rounded-lg
${
  pathname === `/project/${id}`
    ? "text-accent-foreground"
    : "text-muted-foreground"
}
transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <ChartArea className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/project/${id}/tasks`}
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  pathname === `/project/${id}/tasks`
                    ? "text-accent-foreground"
                    : "text-muted-foreground"
                } transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <Workflow className="h-5 w-5" />
                <span className="sr-only">Tasks</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Tasks</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/project/${id}/permissions`}
                className={`flex h-9 w-9 items-center justify-center ${
                  pathname === `/project/${id}/permissions`
                    ? "text-accent-foreground"
                    : "text-muted-foreground"
                } rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <User className="h-5 w-5 " />
                <span className="sr-only">Users</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Users</TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/project/${id}/settings`}
                className={`flex h-9 w-9 items-center justify-center rounded-lg 
                ${
                  pathname.includes("settings")
                    ? "text-accent-foreground"
                    : "text-muted-foreground"
                }
                transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </div>
  );
});
