import Link from "next/link";
import { CalendarIcon, MapPinIcon } from "lucide-react";

import type { RouterOutputs } from "@amaxa/api";
import { Button } from "@amaxa/ui/button";
import { Card } from "@amaxa/ui/card";

export function EventCard({
  event,
}: {
  event: RouterOutputs["events"]["all"][0];
}) {
  return (
    <Card className="h-max-[300px] mx-auto w-full rounded-lg border border-muted bg-secondary/40 p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{event.name}</h3>
          <p className="text-muted-foreground">{event.desc}</p>
        </div>
        <Button size="sm">RSVP</Button>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          <div className="text-muted-foreground">
            {event.time.toLocaleDateString()} {event.time.toLocaleTimeString()}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-5 w-5 text-muted-foreground" />
          <div className="text-muted-foreground">
            <span>{event.isVirtual ? "Online" : "In-Person"}</span>
            <Link
              href={event.registrationLink}
              className="ml-1 underline"
              prefetch={false}
            >
              Join Event
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
