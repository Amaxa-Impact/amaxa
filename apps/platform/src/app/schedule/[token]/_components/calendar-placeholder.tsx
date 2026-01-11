"use client";

import { IconCalendar } from "@tabler/icons-react";

export function CalendarPlaceholder() {
  return (
    <div className="mt-8 rounded-lg border border-dashed p-6 text-center">
      <div className="bg-muted mx-auto mb-3 flex size-12 items-center justify-center rounded-lg">
        <IconCalendar className="text-muted-foreground size-6" />
      </div>
      <p className="text-muted-foreground text-sm font-medium">
        Calendar View Coming Soon
      </p>
      <p className="text-muted-foreground/70 mt-1 text-xs">
        A full calendar view for selecting time slots will be available in a
        future update.
      </p>
    </div>
  );
}
