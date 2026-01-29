"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@amaxa/ui/breadcrumb";
import { SidebarTrigger } from "@amaxa/ui/sidebar";

import { useWorkspace } from "../workspace/context";
import { useDashboardContext } from "./context";

const PAGE_NAMES: Record<string, string> = {
  "": "Dashboard",
  tasks: "Tasks",
  users: "Users",
  settings: "Settings",
};

export function BreadcrumbHeader() {
  const { project } = useDashboardContext();
  const { workspace } = useWorkspace();
  const projectId = project.id;
  const pathname = usePathname();

  const pathParts = pathname.split("/").filter(Boolean);
  const currentPageFromPath = pathParts[3];

  const currentPage = currentPageFromPath ?? "";
  const pageName = PAGE_NAMES[currentPage] ?? currentPage;

  return (
    <header className="border-border bg-background sticky top-0 z-10 border-b">
      <div className="flex items-center gap-2 px-4 py-3">
        <SidebarTrigger className="-ml-1" />
        <div className="bg-border h-5 w-px" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" render={<Link href="/" />}>
                Àmaxa
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href={`/${workspace.slug}`} />}>
                {workspace.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                render={
                  <Link
                    href={`/workspace/${workspace.slug}/project/${projectId}`}
                  />
                }
              >
                {project.name || "No Project Found"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{pageName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
