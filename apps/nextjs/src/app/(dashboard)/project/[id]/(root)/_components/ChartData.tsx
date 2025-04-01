"use client";;
import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartConfig } from "@amaxa/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@amaxa/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@amaxa/ui/chart";

import { api } from "~/trpc/react";

import { useSuspenseQuery } from "@tanstack/react-query";

const chartConfig = {
  tasksFinished: {
    label: "Tasks Finished",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function ProjectDashboard({ id }: { id: string }) {
  const trpc = useTRPC();
  const {
    data: taskData
  } = useSuspenseQuery(api.tasks.getTasksOverTime.queryOptions({
    projectId: id,
  }));
  const {
    data: priorityData
  } = useSuspenseQuery(api.tasks.getTaskPriorities.queryOptions({
    projectId: id,
  }));
  const {
    data: statusData
  } = useSuspenseQuery(api.tasks.getTaskStatuses.queryOptions({
    projectId: id,
  }));

  return (
    <main className="max-h-screen px-10">
      <div className="grid grid-rows-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2 row-span-1">
          <CardHeader>
            <CardTitle>Tasks Finished Over Time</CardTitle>
            <CardDescription>
              Number of tasks completed each month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart
                data={taskData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="tasksFinished"
                  stroke={chartConfig.tasksFinished.color}
                  fill={chartConfig.tasksFinished.color}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Trending up by 10% this month{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  {taskData[0]?.month} - {taskData[taskData.length - 1]?.month}
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
        <Card className="col-span-1 row-span-1">
          <CardHeader>
            <CardTitle>Task Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-full w-full" config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3 row-span-1">
          <CardHeader>
            <CardTitle>Task Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-full w-full" config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="priority" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
