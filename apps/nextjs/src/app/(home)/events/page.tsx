import { unstable_noStore as noStore } from "next/cache";
import { z } from "zod";

import { api } from "~/trpc/server";
import { CreateEvent } from "./_components/CreateEvent";
import { EventCard } from "./_components/EventCard";

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
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-screen-xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Events</h1>
          <CreateEvent />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
          {data.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
