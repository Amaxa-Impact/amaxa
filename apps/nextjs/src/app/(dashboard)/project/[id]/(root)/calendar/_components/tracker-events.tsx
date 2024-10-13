// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { cn } from "@amaxa/ui";

import { secondsToHoursAndMinutes } from "~/utils/format";

export function TrackerEvents({
  data,
  isToday,
}: {
  data: any;
  isToday: boolean;
}) {
  return (
    <div className="flex w-full flex-col space-y-2 font-sans">
      {data && data.length > 0 && (
        <div
          className={cn(
            "line-clamp-1 w-full bg-[#F0F0F0] p-1 text-left text-xs text-[#606060] dark:bg-[#1D1D1D] dark:text-[#878787]",
            isToday && "!bg-background",
          )}
          key={data[0].id}
        >
          {data[0].project.name} ({secondsToHoursAndMinutes(data[0].duration)})
        </div>
      )}
      {data && data.length > 1 && (
        <div className="w-full p-1 text-left text-xs text-primary">
          +{data.length - 1} more
        </div>
      )}
    </div>
  );
}
