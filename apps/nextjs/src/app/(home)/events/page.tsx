import { type } from "arktype";

import { CreateEvent } from "./_components/CreateEvent";
import { EventCard } from "./_components/EventCard";

const searchParamsSchema = type({
  name: "string | undefined",
});

export default function Home(props: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const data = searchParamsSchema(props.searchParams);
  if (data instanceof type.errors) {
    console.error(data);
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Events</h1>
        <CreateEvent />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
