import { endOfMonth, formatISO, startOfMonth } from "date-fns";

import { OpenTrackerSheet } from "./_components/open-tracker-sheet";
import { TrackerCalendar } from "./_components/project-calendar";

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

export default async function Page({ params, searchParams }: ProjectPageProps) {
  const { id } = params;

  const status = searchParams.statuses;
  const sort = searchParams.sort.split(":") ?? ["status", "asc"];

  const currentDate =
    searchParams.date ?? formatISO(new Date(), { representation: "date" });

  return (
    <main className="max-h-screen px-10">
      <TrackerCalendar
        weekStartsOnMonday={true}
        timeFormat={12}
        data={[]}
        meta={[]}
      />

      <div className="mb-6 mt-14 flex items-center justify-between space-x-4">
        <h2 className="text-md font-medium">Tasks</h2>

        <div className="flex space-x-2">
          <OpenTrackerSheet />
        </div>
      </div>
    </main>
  );
}
