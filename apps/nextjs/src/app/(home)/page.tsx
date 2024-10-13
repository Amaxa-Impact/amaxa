import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardFooter, CardHeader } from "@amaxa/ui/card";

import { checkAuth } from "~/lib/auth";
import { api, HydrateClient } from "~/trpc/server";
import { CreateProject } from "./_components/create-project-dialog";
import { ProjectCards } from "./_components/project-cards";

export default async function Page() {
  void api.projects.findAll.prefetch({});
  const session = await checkAuth();
  console.log(session.user.projects);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-screen-xl">
        <div className="flex w-full flex-col gap-5">
          <div className="flex flex-col gap-6">
            <div className="flex flex-row justify-between gap-6">
              <h3 className="text-4xl font-semibold">Your Project</h3>
              {session.user.role == "Admin" ? <CreateProject /> : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
              {session.user.status == "Pending" ? (
                <Card className="col-span-1 row-span-1 flex h-[300px] w-[300px] flex-col items-center justify-center border-dashed bg-secondary/10 transition-transform duration-200">
                  <CardHeader>
                    Your account is pending approval, please wait for the admin
                    to approve your account
                  </CardHeader>
                </Card>
              ) : session.user.status == "Unverified" ? (
                <Card className="col-span-1 row-span-1 flex h-[300px] w-[300px] flex-col items-center justify-center border-dashed bg-secondary/10 transition-transform duration-200">
                  <CardHeader>
                    Your account is unverified, please wait till we verify your
                    account to access the platform
                  </CardHeader>
                </Card>
              ) : (
                <div>
                  {session.user.projects?.map((project) => {
                    return (
                      <Link key={project.id} href={`/project/${project.id}`}>
                        <Card className="col-span-1 row-span-1 bg-secondary/10 transition-transform duration-200">
                          <CardContent className="py-5">
                            <Image
                              src={project.image ?? ""}
                              width={1000}
                              height={500}
                              alt={String(project.id)}
                            />
                          </CardContent>
                          <CardFooter className="justify-center text-center font-bold md:text-2xl">
                            {project.name}
                          </CardFooter>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h3 className="text-4xl font-semibold">Explore Projects</h3>
            <HydrateClient>
              <Suspense fallback={<div></div>}>
                <ProjectCards />
              </Suspense>
            </HydrateClient>
          </div>
        </div>
      </div>
    </div>
  );
}
