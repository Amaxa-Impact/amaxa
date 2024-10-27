import { Card, CardContent, CardHeader, CardTitle } from "@amaxa/ui/card";
import { Skeleton } from "@amaxa/ui/skeleton";

export function TasksOverTimeSkeletonCard() {
  return (
    <Card className="col-span-2 row-span-1">
      <CardHeader>
        <CardTitle>Tasks Finished Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
}

export function TaskStatusSkeletonCard() {
  return (
    <Card className="col-span-1 row-span-1">
      <CardHeader>
        <CardTitle>Task Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[200px] w-full" />
      </CardContent>
    </Card>
  );
}

export function TaskPrioritySkeletonCard() {
  return (
    <Card className="col-span-3 row-span-1">
      <CardHeader>
        <CardTitle>Task Priority</CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[200px] w-full" />
      </CardContent>
    </Card>
  );
}
