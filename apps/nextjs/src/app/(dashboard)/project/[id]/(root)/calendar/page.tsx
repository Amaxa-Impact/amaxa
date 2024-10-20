import {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
  CalendarYearView,
} from "@/components/calendar-full";
import { addHours, endOfMonth, formatISO, startOfMonth } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectPageProps {
  params: {
    id: string;
  };
  searchParams: {
    statuses: string;
    sort: string;
    q: string;
    start?: string;
    end?: string;
    date?: string;
  };
}

export default function Page({ params, searchParams }: ProjectPageProps) {
  return (
    <main className="max-h-screen px-10">
      <Calendar
        events={[
          {
            id: "1",
            start: new Date(),
            end: addHours(new Date(), 2),
            title: "event A",
            color: "pink",
          },
          {
            id: "2",
            start: addHours(new Date(), 1.5),
            end: addHours(new Date(), 3),
            title: "event B",
            color: "blue",
          },
        ]}
      >
        <div className="flex h-dvh flex-col p-14">
          <div className="mb-6 flex items-center gap-2 px-6">
            <CalendarViewTrigger
              className="aria-[current=true]:bg-accent"
              view="day"
            >
              Day
            </CalendarViewTrigger>
            <CalendarViewTrigger
              view="week"
              className="aria-[current=true]:bg-accent"
            >
              Week
            </CalendarViewTrigger>
            <CalendarViewTrigger
              view="month"
              className="aria-[current=true]:bg-accent"
            >
              Month
            </CalendarViewTrigger>
            <CalendarViewTrigger
              view="year"
              className="aria-[current=true]:bg-accent"
            >
              Year
            </CalendarViewTrigger>

            <span className="flex-1" />

            <CalendarCurrentDate />

            <CalendarPrevTrigger>
              <ChevronLeft size={20} />
              <span className="sr-only">Previous</span>
            </CalendarPrevTrigger>

            <CalendarTodayTrigger>Today</CalendarTodayTrigger>

            <CalendarNextTrigger>
              <ChevronRight size={20} />
              <span className="sr-only">Next</span>
            </CalendarNextTrigger>
          </div>

          <div className="flex-1 overflow-hidden px-6">
            <CalendarDayView />
            <CalendarWeekView />
            <CalendarMonthView />
            <CalendarYearView />
          </div>
        </div>
      </Calendar>
    </main>
  );
}
