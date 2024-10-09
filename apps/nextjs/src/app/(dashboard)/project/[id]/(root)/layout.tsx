/** eslint-disable @typescript-eslint/no-non-null-assertion */
/** eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { db } from "@amaxa/db/client";
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
import { checkAuth } from "~/lib/auth";
import GetLastBreadCrumb from "./_components/LastItem";
import SearchBar from "./_components/search";

const getProjectInfo = cache(async (id: string) => {
  const data = await db.query.Projects.findFirst({
    where: (Project, { eq }) => eq(Project.id, id),
    columns: {
      name: true,
      id: true,
    },
  });
  return data;
});

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    id: string;
  };
}) {
  const { id } = params;
  // take data and auth and fetch them with Promise.all
  const [data, auth] = await Promise.all([getProjectInfo(id), checkAuth()]);

  if (!data) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col ">
      <AppSidebar
        id={data.id}
        user={{
          name: auth.user.name!,
          email: auth.user.email!,
          avatar: auth.user.image!,
        }}
        teamSwitcher={<TeamSwitcher />}
      />
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
                  <Link href={`/project/${data.id}`}>{data.name}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <GetLastBreadCrumb id={data.id} />
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
