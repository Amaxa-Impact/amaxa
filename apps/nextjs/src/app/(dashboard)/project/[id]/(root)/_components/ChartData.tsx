import { TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@amaxa/ui/card";

import {
  getTaskPriorities,
  getTasksOverTime,
  getTaskStatuses,
} from "~/server/scripts";
import {
  TaskPriorityChartClient,
  TasksOverTimeChartClient,
  TaskStatusChartClient,
} from "./chart-client";

export async function TasksOverTimeChart({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.ReactElement> {
  const projectId = (await params).id;
  const taskData = await getTasksOverTime({ projectId });

  return (
    <Card className="col-span-2 row-span-1">
      <CardHeader>
        <CardTitle>Tasks Finished Over Time</CardTitle>
        <CardDescription>Number of tasks completed each month</CardDescription>
      </CardHeader>
      <CardContent>
        <TasksOverTimeChartClient taskData={taskData} />
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 10% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {taskData[0]?.month} - {taskData[taskData.length - 1]?.month}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export async function TaskStatusChart({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.ReactElement> {
  const projectId = (await params).id;
  const statusData = await getTaskStatuses({ projectId });

  return (
    <Card className="col-span-1 row-span-1">
      <CardHeader>
        <CardTitle>Task Status</CardTitle>
      </CardHeader>
      <CardContent>
        <TaskStatusChartClient statusData={statusData} />
      </CardContent>
    </Card>
  );
}

export async function TaskPriorityChart({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.ReactElement> {
  const projectId = (await params).id;
  const priorityData = await getTaskPriorities({ projectId });

  return (
    <Card className="col-span-3 row-span-1">
      <CardHeader>
        <CardTitle>Task Priority</CardTitle>
      </CardHeader>
      <CardContent>
        <TaskPriorityChartClient priorityData={priorityData} />
      </CardContent>
    </Card>
  );
}
