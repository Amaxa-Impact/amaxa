import React from "react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@amaxa/ui/breadcrumb";
import { SidebarTrigger } from "@amaxa/ui/sidebar";

import { AppSidebar } from "~/components/navbar/app-sidebar";
import { TeamSwitcher } from "~/components/navbar/switcher";
import { UserMenu } from "~/components/UserMenu";
import GetLastBreadCrumb from "./_components/LastItem";
import SearchBar from "./_components/search";

export const experimental_ppr = true;

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    id: string;
  };
}) {
  const { id } = params;

  return (
    <div className="flex min-h-screen w-full flex-col ">
      <AppSidebar id={id} teamSwitcher={<TeamSwitcher />} />
      <div className="flex flex-col sm:gap-4 sm:py-4 ">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <SidebarTrigger />
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/project/`}>Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/project/${id}`}>Project</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <GetLastBreadCrumb id={id} />
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <SearchBar />
          <UserMenu />
        </header>
        {children}
      </div>
    </div>
  );
}
