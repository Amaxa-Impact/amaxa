"use client";

import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
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

const chartConfig = {
  tasksFinished: {
    label: "Tasks Finished",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const COLORS = ["#3498db", "#e74c3c", "#2ecc71", "#f39c12"];

export function ProjectDashboard({ id }: { id: string }) {
  const [taskData] = api.tasks.getTasksOverTime.useSuspenseQuery({
    projectId: id,
  });
  const [priorityData] = api.tasks.getTaskPriorities.useSuspenseQuery({
    projectId: id,
  });
  const [statusData] = api.tasks.getTaskStatuses.useSuspenseQuery({
    projectId: id,
  });

  return (
    <main className="px-10">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
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
      </div>
    </main>
  );
}
