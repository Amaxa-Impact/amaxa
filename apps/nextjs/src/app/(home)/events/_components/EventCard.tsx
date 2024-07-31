import { RouterOutputs } from "@amaxa/api"
import { Button } from "@amaxa/ui/button"
import { Card } from "@amaxa/ui/card"
import { CalendarIcon, MapPinIcon } from "lucide-react"
import Link from "next/link"

export function EventCard({
  event
}: {
  event: RouterOutputs['events']['all'][0]
}) {
  return (
    <Card className="max-w-md mx-auto p-6 bg-background border border-muted rounded-lg shadow-sm min-w-[500px]">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{event.name}</h3>
          <p className="text-muted-foreground">{event.desc}</p>
        </div>
        <Button size="sm">RSVP</Button>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-muted-foreground" />
          <div className="text-muted-foreground">
            {event.time.toLocaleDateString()} {event.time.toLocaleTimeString()}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MapPinIcon className="w-5 h-5 text-muted-foreground" />
          <div className="text-muted-foreground">
            <span>{event.isVirtual ? "Online" : "In-Person"}</span>
            <Link href={event.registrationLink} className="underline ml-1" prefetch={false}>
              Join Event
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}
