import React, { Suspense } from "react";

import { Card, CardContent, CardFooter } from "@amaxa/ui/card";
import { Skeleton } from "@amaxa/ui/skeleton";

import { ExploreProjects } from "./_components/explore-projects";
import { UserProjects } from "./_components/UserProjects";

export const experimental_ppr = true;

const OneLoading = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row justify-between gap-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="col-span-1 row-span-1 bg-secondary/10">
            <CardContent className="py-5">
              <Skeleton className="h-40 w-full" />
            </CardContent>
            <CardFooter className="justify-center">
              <Skeleton className="h-6 w-3/4" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const TwoLoading = () => {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="col-span-1 row-span-1 bg-secondary/10">
              <CardContent className="py-5">
                <Skeleton className="h-40 w-full" />
              </CardContent>
              <CardFooter className="justify-center">
                <Skeleton className="h-6 w-3/4" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
export default function Page() {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="flex w-full flex-col gap-5">
        <Suspense fallback={<OneLoading />}>
          <UserProjects />
        </Suspense>
        <Suspense fallback={<TwoLoading />}>
          <ExploreProjects />
        </Suspense>
      </div>
    </div>
  );
}
