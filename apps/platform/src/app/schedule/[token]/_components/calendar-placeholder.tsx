"use client";

import { IconCalendar } from "@tabler/icons-react";

export function CalendarPlaceholder() {
  return (
    <div className="mt-8 rounded-lg border border-dashed p-6 text-center">
      <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-lg bg-muted">
        <IconCalendar className="size-6 text-muted-foreground" />
      </div>
      <p className="font-medium text-muted-foreground text-sm">
        Calendar View Coming Soon
      </p>
      <p className="mt-1 text-muted-foreground/70 text-xs">
        A full calendar view for selecting time slots will be available in a
        future update.
      </p>
    </div>
  );
}
