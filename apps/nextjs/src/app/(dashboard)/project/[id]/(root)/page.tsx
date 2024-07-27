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

interface ProjectPageProps {
  params: {
    id: string;
  };
}

const chartConfig = {
  tasksFinished: {
    label: "Tasks Finished",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const getTaskData = () => {
  return [
    { month: "January", tasksFinished: 18 },
    { month: "February", tasksFinished: 30 },
    { month: "March", tasksFinished: 23 },
    { month: "April", tasksFinished: 7 },
    { month: "May", tasksFinished: 20 },
    { month: "June", tasksFinished: 21 },
  ];
};

const getPriorityData = () => {
  return [
    { priority: "Low", count: 15 },
    { priority: "Medium", count: 30 },
    { priority: "High", count: 20 },
  ];
};

const getStatusData = () => {
  return [
    { status: "todo", count: 10 },
    { status: "in-progress", count: 15 },
    { status: "done", count: 40 },
    { status: "unable-to-complete", count: 5 },
  ];
};

export default function HomePage({ params }: ProjectPageProps) {
  const { id } = params;
  const taskData = getTaskData();
  const priorityData = getPriorityData();
  const statusData = getStatusData();
  return (
    <main className="px-10">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Tasks Finished Over Time project {id}</CardTitle>
            <CardDescription>
              Number of tasks completed each month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
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
                  stroke="#8884d8"
                  fill="#8884d8"
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
                  January - June 2024
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Priority Distribution</CardTitle>
            <CardDescription>Breakdown of tasks by priority</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {priorityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>Low, Medium, and High priority tasks</CardFooter>
        </Card>

        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Task Status Overview</CardTitle>
            <CardDescription>Current status of all tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart
                data={statusData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            Todo, In Progress, Done, and Unable to Complete statuses
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
