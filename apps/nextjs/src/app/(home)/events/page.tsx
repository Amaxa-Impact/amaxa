import { unstable_noStore as noStore } from "next/cache";
import { z } from "zod";

import { api } from "~/trpc/server";
import { CreateEvent } from "./_components/CreateEvent";
import { EventCard } from "./_components/EventCard";
import { NoEvents } from "./_components/NoEvents";

const searchParamsSchema = z.object({
  name: z.string().optional(),
});

export default async function Home(props: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  noStore();
  const { name } = searchParamsSchema.parse(props.searchParams);

  const data = await api.events.all({
    name: name,
  });

  return (
    <div className="p-5">
      <div className="flex flex-row items-center justify-between py-5">
        <div className="flex flex-col gap-3">
          <h1 className="text-5xl font-bold">Events</h1>
          <div>RSVP to upcoming events</div>
        </div>
        <div className="flex justify-between gap-5">
          <div />
          <div>{data.length > 0 && <CreateEvent />}</div>
        </div>
      </div>
      {data.length === 0 && (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="h-[500px]">
            <NoEvents />
          </div>
        </main>
      )}
      <div className="space-y-6">
        <div className="grid grid-cols-3 grid-rows-3 gap-4 md:gap-6">
          {data.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic"
