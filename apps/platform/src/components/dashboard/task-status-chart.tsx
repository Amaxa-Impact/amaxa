"use client";

import { Label, Pie, PieChart } from "recharts";

import type { ChartConfig } from "@amaxa/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@amaxa/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@amaxa/ui/chart";

interface StatusCounts {
  todo: number;
  in_progress: number;
  completed: number;
  blocked: number;
}

interface TaskStatusChartProps {
  title: string;
  description?: string;
  data?: StatusCounts;
  total?: number;
}

const chartConfig: ChartConfig = {
  count: {
    label: "Tasks",
  },
  todo: {
    label: "To Do",
    color: "var(--chart-1)",
  },
  in_progress: {
    label: "In Progress",
    color: "var(--chart-2)",
  },
  completed: {
    label: "Completed",
    color: "var(--chart-3)",
  },
  blocked: {
    label: "Blocked",
    color: "var(--chart-4)",
  },
};

export function TaskStatusChart({
  title,
  description,
  data,
  total,
}: TaskStatusChartProps) {
  const chartData = [
    { status: "todo", count: data?.todo, fill: "var(--color-todo)" },
    {
      status: "in_progress",
      count: data?.in_progress,
      fill: "var(--color-in_progress)",
    },
    {
      status: "completed",
      count: data?.completed,
      fill: "var(--color-completed)",
    },
    { status: "blocked", count: data?.blocked, fill: "var(--color-blocked)" },
  ].filter((d) => d.count != null && d.count > 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {total === 0 ? (
          <div className="flex h-[250px] items-center justify-center">
            <p className="text-muted-foreground text-sm">No tasks</p>
          </div>
        ) : (
          <ChartContainer
            className="mx-auto aspect-square max-h-[250px]"
            config={chartConfig}
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent hideLabel />}
                cursor={false}
              />
              <Pie
                data={chartData}
                dataKey="count"
                innerRadius={60}
                nameKey="status"
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          dominantBaseline="middle"
                          textAnchor="middle"
                          x={viewBox.cx}
                          y={viewBox.cy}
                        >
                          <tspan
                            className="fill-foreground text-3xl font-bold"
                            x={viewBox.cx}
                            y={viewBox.cy}
                          >
                            {total}
                          </tspan>
                          <tspan
                            className="fill-muted-foreground"
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 24}
                          >
                            Tasks
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
