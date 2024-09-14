"use client";

import React from "react";
import { AreaChart, TrendingUp } from "lucide-react";
import { Area, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@amaxa/ui/chart";

export const OverallChart = (props: {}) => {
  const [taskData] = api.tasks.getTasksOverTime.useSuspenseQuery({
    projectId: id,
  });
  return (
    <div>
      <div className="flex w-full items-start gap-2 text-sm">
        <div className="grid gap-2">
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
          <div className="flex items-center gap-2 font-medium leading-none">
            Trending up by 10% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-2 leading-none text-muted-foreground">
            {taskData[0]?.month} - {taskData[taskData.length - 1]?.month}
          </div>
        </div>
      </div>
    </div>
  );
};
