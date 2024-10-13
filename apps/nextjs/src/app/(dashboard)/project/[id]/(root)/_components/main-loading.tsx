"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@amaxa/ui/card";
import { Skeleton } from "@amaxa/ui/skeleton";

export function ProjectDashboardSkeleton() {
  return (
    <main className="max-h-screen px-10">
      <div className="grid grid-rows-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2 row-span-1">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-3/4" />
            </CardTitle>
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
          <CardContent>
            <Skeleton className="h-4 w-1/4" />
          </CardContent>
        </Card>
        <Card className="col-span-1 row-span-1">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-1/2" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
        <Card className="col-span-3 row-span-1">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-1/3" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
