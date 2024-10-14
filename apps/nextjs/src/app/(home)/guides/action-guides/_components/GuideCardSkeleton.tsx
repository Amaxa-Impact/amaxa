import React from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@amaxa/ui/card";
import { Input } from "@amaxa/ui/input";
import { Skeleton } from "@amaxa/ui/skeleton";

const GuidesSkeleton = () => {
  return (
    <div className="mx-auto px-4 py-8 md:px-6">
      <h1 className="mb-6 text-3xl font-bold">Action Guides</h1>
      <div className="mb-6 flex flex-row justify-between">
        <Input
          placeholder="Search action guides..."
          className="w-full max-w-md"
          disabled
        />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="h-[200px]">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-2/3" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-1/4" />
              </CardFooter>
            </Card>
          </Skeleton>
        ))}
      </div>
    </div>
  );
};

export default GuidesSkeleton;
