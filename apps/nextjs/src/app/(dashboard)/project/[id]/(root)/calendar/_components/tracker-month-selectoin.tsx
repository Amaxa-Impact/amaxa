// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { TZDate } from "@date-fns/tz";
import { addMonths, format, formatISO, startOfMonth } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@amaxa/ui";
import { Button } from "@amaxa/ui/button";

import { useTrackerParams } from "./hooks";

interface Props {
  className?: string;
  dateFormat?: string;
}

export function TrackerMonthSelect({ className, dateFormat = "MMM" }: Props) {
  const { date, setParams } = useTrackerParams();
  const currentDate = date
    ? new TZDate(date, "UTC")
    : new TZDate(new Date(), "UTC");

  const selectPrevMonth = () => {
    void setParams(
      {
        date: formatISO(startOfMonth(addMonths(currentDate, -1)), {
          representation: "date",
        }),
      },
      { shallow: false },
    );
  };

  const selectNextMonth = () => {
    void setParams(
      {
        date: formatISO(startOfMonth(addMonths(currentDate, 1)), {
          representation: "date",
        }),
      },
      { shallow: false },
    );
  };

  return (
    <div className={cn("flex h-9 items-center border", className)}>
      <Button
        variant="ghost"
        size="icon"
        className="ml-2 mr-4 h-6 w-6 p-0 hover:bg-transparent"
        onClick={selectPrevMonth}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <span className="w-full text-center">
        {format(currentDate, dateFormat)}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="ml-4 mr-2 h-6 w-6 p-0 hover:bg-transparent"
        onClick={selectNextMonth}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
}
