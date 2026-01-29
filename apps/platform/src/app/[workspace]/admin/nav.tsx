"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWorkspace } from "@/components/workspace/context";
import {
  IconArrowLeft,
  IconFileDescription,
  IconFolder,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { cn } from "@amaxa/ui";
import { buttonVariants } from "@amaxa/ui/button";

interface NavTabProps {
  href: string;
  isActive: boolean;
  icon: ReactNode;
  children: ReactNode;
}

function NavTab({ href, isActive, icon, children }: NavTabProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:border-border/60 hover:text-foreground",
      )}
    >
      {icon}
      {children}
    </Link>
  );
}

export function WorkspaceNav() {
  const { workspace } = useWorkspace();
  const pathname = usePathname();

  const activeTab = useMemo(() => {
    if (pathname.includes("/settings")) return "settings";
    if (pathname.includes("/users")) return "users";
    if (pathname.includes("/templates")) return "templates";
    if (pathname.includes("/projects")) return "projects";
    return "projects";
  }, [pathname]);

  const baseUrl = `/${workspace.slug}/admin`;

  return (
    <nav className="border-border/40 bg-background/95 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-2">
        <Link
          href="/workspaces"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "group gap-1.5 text-muted-foreground hover:text-foreground",
          )}
        >
          <IconArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="hidden sm:inline">Back</span>
        </Link>

        <div className="bg-border h-5 w-px" />

        <div className="flex min-w-0 items-center gap-2">
          <h1 className="truncate text-sm font-semibold">{workspace.name}</h1>
          <span className="bg-muted text-muted-foreground hidden rounded px-1.5 py-0.5 font-mono text-xs sm:inline">
            /{workspace.slug}
          </span>
        </div>

        <div className="flex-1" />

        <div className="-mb-px flex">
          <NavTab
            href={`${baseUrl}/projects`}
            isActive={activeTab === "projects"}
            icon={<IconFolder className="size-4" />}
          >
            <span className="hidden sm:inline">Projects</span>
          </NavTab>
          <NavTab
            href={`${baseUrl}/templates`}
            isActive={activeTab === "templates"}
            icon={<IconFileDescription className="size-4" />}
          >
            <span className="hidden sm:inline">Templates</span>
          </NavTab>
          <NavTab
            href={`${baseUrl}/users`}
            isActive={activeTab === "users"}
            icon={<IconUsers className="size-4" />}
          >
            <span className="hidden sm:inline">Users</span>
          </NavTab>
          <NavTab
            href={`${baseUrl}/settings`}
            isActive={activeTab === "settings"}
            icon={<IconSettings className="size-4" />}
          >
            <span className="hidden sm:inline">Settings</span>
          </NavTab>
        </div>
      </div>
    </nav>
  );
}
