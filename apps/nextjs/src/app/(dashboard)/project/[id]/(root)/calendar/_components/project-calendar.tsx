"use client";

import { useCallback, useState } from "react";
import { TZDate } from "@date-fns/tz";
import { useClickAway } from "@uidotdev/usehooks";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  formatISO,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { Info } from "lucide-react";
import MotionNumber from "motion-number";
import { useHotkeys } from "react-hotkeys-hook";

import { cn } from "@amaxa/ui";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@amaxa/ui/tooltip";

import { formatAmount, secondsToHoursAndMinutes } from "~/utils/format";
import { useTrackerParams } from "./hooks";
import { TrackerEvents } from "./tracker-events";
import { TrackerMonthSelect } from "./tracker-month-selectoin";
import { TrackerSettings } from "./tracker-settings";

interface Props {
  weekStartsOnMonday?: boolean;
  timeFormat: number;
  data: any;
  meta: any;
}

export function TrackerCalendar({
  weekStartsOnMonday = false,
  timeFormat,
  data,
  meta,
}: Props) {
  const {
    date: currentDate,
    range,
    setParams,
    selectedDate,
  } = useTrackerParams();
  const [localRange, setLocalRange] = useState<[string, string | null]>([
    "",
    null,
  ]);
  const [isDragging, setIsDragging] = useState(false);

  const { calendarDays, firstWeek } = useCalendarDates(
    new TZDate(currentDate, "UTC"),
    weekStartsOnMonday,
  );

  useHotkeys(
    "arrowLeft",
    () => handleMonthChange(-1, new TZDate(currentDate, "UTC"), setParams),
    {
      enabled: !selectedDate,
    },
  );

  useHotkeys(
    "arrowRight",
    () => handleMonthChange(1, new TZDate(currentDate, "UTC"), setParams),
    {
      enabled: !selectedDate,
    },
  );

  const ref = useClickAway<HTMLDivElement>(() => {
    if (range?.length === 1) setParams({ range: null });
  });

  const handleMouseDown = (date: TZDate) => {
    setIsDragging(true);
    setLocalRange([formatISO(date, { representation: "date" }), null]);
  };

  const handleMouseEnter = (date: TZDate) => {
    if (isDragging) {
      setLocalRange((prev) => [
        prev[0],
        formatISO(date, { representation: "date" }),
      ]);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (localRange[0] && localRange[1]) {
      let start = new TZDate(localRange[0], "UTC");
      let end = new TZDate(localRange[1], "UTC");
      if (start > end) [start, end] = [end, start];

      setParams({ range: [localRange[0], localRange[1]] });
    } else if (localRange[0]) {
      setParams({ selectedDate: localRange[0] });
    }
    setLocalRange(["", null]);
  };

  return (
    <div ref={ref}>
      <div className="mt-8">
        <CalendarHeader
          meta={meta}
          data={data}
          timeFormat={timeFormat}
          weekStartsOnMonday={weekStartsOnMonday}
        />
        <CalendarGrid
          firstWeek={firstWeek}
          calendarDays={calendarDays}
          currentDate={new TZDate(currentDate, "UTC")}
          selectedDate={selectedDate ?? ""}
          data={data}
          range={
            range ?? [
              "Sun Oct 06 2024 12:31:51 GMT-0600 (Mountain Daylight Time)",
              "Sun Oct 06 2024 12:22:51 GMT-0600 (Mountain Daylight Time)",
            ]
          }
          localRange={localRange}
          isDragging={isDragging}
          weekStartsOnMonday={weekStartsOnMonday}
          handleMouseDown={handleMouseDown}
          handleMouseEnter={handleMouseEnter}
          handleMouseUp={handleMouseUp}
        />
      </div>
    </div>
  );
}

function useCalendarDates(currentDate: TZDate, weekStartsOnMonday: boolean) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, {
    weekStartsOn: weekStartsOnMonday ? 1 : 0,
  });
  const calendarEnd = endOfWeek(monthEnd, {
    weekStartsOn: weekStartsOnMonday ? 1 : 0,
  });
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  }).map((date) => new TZDate(date, "UTC"));
  const firstWeek = eachDayOfInterval({
    start: calendarStart,
    end: endOfWeek(calendarStart, { weekStartsOn: weekStartsOnMonday ? 1 : 0 }),
  }).map((date) => new TZDate(date, "UTC"));

  return {
    monthStart,
    monthEnd,
    calendarStart,
    calendarEnd,
    calendarDays,
    firstWeek,
  };
}

function handleMonthChange(
  direction: number,
  currentDate: TZDate,
  setParams: (params: any) => void,
) {
  const newDate =
    direction > 0 ? addMonths(currentDate, 1) : subMonths(currentDate, 1);
  setParams({
    date: formatISO(newDate, { representation: "date" }),
  });
}

interface CalendarHeaderProps {
  meta: { totalDuration?: number };
  data: Record<string, TrackerEvent[]>;
  timeFormat: number;
  weekStartsOnMonday: boolean;
}

function CalendarHeader({
  meta,
  data,
  timeFormat,
  weekStartsOnMonday,
}: CalendarHeaderProps) {
  const projectTotals = Object.entries(data).reduce(
    (acc, [_, events]) => {
      for (const event of events) {
        const projectName = event.project?.name;
        if (projectName) {
          if (!acc[projectName]) {
            acc[projectName] = {
              duration: 0,
              amount: 0,
              currency: event.project.currency,
              rate: event.project.rate,
            };
          }
          const project = acc[projectName];
          project.duration += event.duration;
          project.amount = (project.duration / 3600) * project.rate;
        }
      }
      return acc;
    },
    {} as Record<
      string,
      { duration: number; amount: number; currency: string; rate: number }
    >,
  );

  const sortedProjects = Object.entries(projectTotals)
    .sort(([, a], [, b]) => b.duration - a.duration)
    .map(([name, { duration, amount, currency }]) => ({
      name,
      duration,
      amount,
      currency,
    }));

  const mostUsedCurrency = Object.values(projectTotals).reduce(
    (acc, { currency }) => {
      if (currency !== null) {
        acc[currency] = (acc[currency] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const dominantCurrency =
    Object.entries(mostUsedCurrency).length > 0
      ? Object.entries(mostUsedCurrency).reduce((a, b) =>
          a[1] > b[1] ? a : b,
        )[0]
      : null;

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="select-text space-y-2">
        <h1 className="text-4xl ">Upcoming Meetings, Events and Tasks</h1>
      </div>
      <div className="flex space-x-2">
        <TrackerMonthSelect dateFormat="MMMM" />
        <TrackerSettings
          timeFormat={timeFormat}
          weekStartsOnMonday={weekStartsOnMonday}
        />
      </div>
    </div>
  );
}

interface CalendarGridProps {
  firstWeek: TZDate[];
  calendarDays: TZDate[];
  currentDate: TZDate;
  selectedDate: string;
  data: Record<string, TrackerEvent[]>;
  range: [string, string] | null;
  localRange: [string, string | null];
  isDragging: boolean;
  weekStartsOnMonday: boolean;
  handleMouseDown: (date: TZDate) => void;
  handleMouseEnter: (date: TZDate) => void;
  handleMouseUp: () => void;
}

function CalendarGrid({
  firstWeek,
  calendarDays,
  currentDate,
  selectedDate,
  data,
  range,
  localRange,
  isDragging,
  handleMouseDown,
  handleMouseEnter,
  handleMouseUp,
}: CalendarGridProps) {
  return (
    <div className="grid grid-cols-7 gap-px rounded-sm border border-border bg-border">
      {firstWeek.map((day) => (
        <div
          key={day.toString()}
          className="bg-background px-3 py-4 text-xs font-medium "
        >
          {format(day, "EEE").toUpperCase()}
        </div>
      ))}
      {calendarDays.map((date, index) => (
        <CalendarDay
          key={index.toString()}
          date={date}
          currentDate={currentDate}
          selectedDate={selectedDate}
          data={data}
          range={range}
          localRange={localRange}
          isDragging={isDragging}
          handleMouseDown={handleMouseDown}
          handleMouseEnter={handleMouseEnter}
          handleMouseUp={handleMouseUp}
        />
      ))}
    </div>
  );
}

interface CalendarDayProps {
  date: TZDate;
  currentDate: TZDate;
  selectedDate: string;
  data: Record<string, TrackerEvent[]>;
  range: [string, string] | null;
  localRange: [string, string | null];
  isDragging: boolean;
  handleMouseDown: (date: TZDate) => void;
  handleMouseEnter: (date: TZDate) => void;
  handleMouseUp: () => void;
}

function CalendarDay({
  date,
  currentDate,
  selectedDate,
  data,
  range,
  localRange,
  isDragging,
  handleMouseDown,
  handleMouseEnter,
  handleMouseUp,
}: CalendarDayProps) {
  const isCurrentMonth = date.getMonth() === currentDate.getMonth();
  const formattedDate = formatISO(date, { representation: "date" });

  const isInRange = useCallback(
    (date: TZDate) => checkIsInRange(date, isDragging, localRange, range),
    [isDragging, localRange, range],
  );

  const isFirstSelectedDate = useCallback(
    (date: TZDate) =>
      checkIsFirstSelectedDate(date, isDragging, localRange, range),
    [isDragging, localRange, range],
  );

  const isLastSelectedDate = useCallback(
    (date: TZDate) =>
      checkIsLastSelectedDate(date, isDragging, localRange, range),
    [isDragging, localRange, range],
  );

  return (
    <div
      onMouseDown={() => handleMouseDown(date)}
      onMouseEnter={() => handleMouseEnter(date)}
      onMouseUp={handleMouseUp}
      className={cn(
        "relative flex aspect-square select-none space-x-2 px-3 pb-10 pt-2 text-left text-lg transition-all duration-100 md:aspect-[4/2]",
        isCurrentMonth && isToday(date)
          ? "bg-[#f0f0f0] dark:bg-[#202020]"
          : "bg-background",
        !isCurrentMonth &&
          "bg-[repeating-linear-gradient(-60deg,#DBDBDB,#DBDBDB_1px,background_1px,background_5px)] dark:bg-[repeating-linear-gradient(-60deg,#2C2C2C,#2C2C2C_1px,background_1px,background_5px)]",
        selectedDate === formattedDate && "ring-1 ring-primary",
        isInRange(date) && "bg-opacity-50 ring-1 ring-primary",
        isFirstSelectedDate(date) && "bg-opacity-50 ring-1 ring-primary",
        isLastSelectedDate(date) && "bg-opacity-50 ring-1 ring-primary",
      )}
    >
      <div>{format(date, "d")}</div>
      <TrackerEvents data={data[formattedDate]} isToday={isToday(date)} />
    </div>
  );
}

function checkIsInRange(
  date: TZDate,
  isDragging: boolean,
  localRange: [string, string | null],
  range: [string, string] | null,
) {
  if (isDragging && localRange[0] && localRange[1]) {
    const start = new TZDate(localRange[0], "UTC");
    const end = new TZDate(localRange[1], "UTC");
    return (
      date >= new TZDate(Math.min(start.getTime(), end.getTime()), "UTC") &&
      date <= new TZDate(Math.max(start.getTime(), end.getTime()), "UTC")
    );
  }
  if (range && range.length === 2) {
    const start = new TZDate(range[0], "UTC");
    const end = new TZDate(range[1], "UTC");
    return (
      date >= new TZDate(Math.min(start.getTime(), end.getTime()), "UTC") &&
      date <= new TZDate(Math.max(start.getTime(), end.getTime()), "UTC")
    );
  }
  return false;
}

function checkIsFirstSelectedDate(
  date: TZDate,
  isDragging: boolean,
  localRange: [string, string | null],
  range: [string, string] | null,
) {
  if (isDragging && localRange[0]) {
    const start = new TZDate(localRange[0], "UTC");
    const end = localRange[1] ? new TZDate(localRange[1], "UTC") : start;
    const firstDate = new TZDate(
      Math.min(start.getTime(), end.getTime()),
      "UTC",
    );
    return (
      formatISO(date, { representation: "date" }) ===
      formatISO(firstDate, { representation: "date" })
    );
  }
  if (range && range.length > 0) {
    const start = new TZDate(range[0], "UTC");
    const end = new TZDate(range[1], "UTC");
    const firstDate = new TZDate(
      Math.min(start.getTime(), end.getTime()),
      "UTC",
    );
    return (
      formatISO(date, { representation: "date" }) ===
      formatISO(firstDate, { representation: "date" })
    );
  }
  return false;
}

function checkIsLastSelectedDate(
  date: TZDate,
  isDragging: boolean,
  localRange: [string, string | null],
  range: [string, string] | null,
) {
  if (isDragging && localRange[0] && localRange[1]) {
    const start = new TZDate(localRange[0], "UTC");
    const end = new TZDate(localRange[1], "UTC");
    const lastDate = new TZDate(
      Math.max(start.getTime(), end.getTime()),
      "UTC",
    );
    return (
      formatISO(date, { representation: "date" }) ===
      formatISO(lastDate, { representation: "date" })
    );
  }
  if (range && range.length === 2) {
    const start = new TZDate(range[0], "UTC");
    const end = new TZDate(range[1], "UTC");
    const lastDate = new TZDate(
      Math.max(start.getTime(), end.getTime()),
      "UTC",
    );
    return (
      formatISO(date, { representation: "date" }) ===
      formatISO(lastDate, { representation: "date" })
    );
  }
  return false;
}
