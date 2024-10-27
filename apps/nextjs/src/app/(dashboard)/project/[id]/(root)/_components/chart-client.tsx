"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@amaxa/ui/chart";

const chartConfig = {
  tasksFinished: {
    label: "Tasks Finished",
    color: "hsl(var(--primary))",
  },
  count: {
    label: "Count",
    color: "hsl(var(--primary))",
  },
};

export function TasksOverTimeChartClient({
  taskData,
}: {
  taskData: Array<{ month: string; tasksFinished: number }>;
}) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
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
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export function TaskStatusChartClient({
  statusData,
}: {
  statusData: Array<{ status: string; count: number }>;
}) {
  return (
    <ChartContainer className="h-full w-full" config={chartConfig}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={statusData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill={chartConfig.count.color} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export function TaskPriorityChartClient({
  priorityData,
}: {
  priorityData: Array<{ priority: string; count: number }>;
}) {
  return (
    <ChartContainer className="h-full w-full" config={chartConfig}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={priorityData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="priority" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill={chartConfig.count.color} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
