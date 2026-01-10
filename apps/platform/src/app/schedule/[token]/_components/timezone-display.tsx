"use client";

import { IconGlobe } from "@tabler/icons-react";
import {
  formatTimezoneDisplay,
  TimezoneSelect,
} from "@/components/scheduling/timezone-select";

interface TimezoneDisplayProps {
  timezone: string;
  onTimezoneChange: (timezone: string) => void;
}

export function TimezoneDisplay({
  timezone,
  onTimezoneChange,
}: TimezoneDisplayProps) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <IconGlobe className="size-4" />
        <span>Times shown in: {formatTimezoneDisplay(timezone)}</span>
      </div>
      <TimezoneSelect
        className="w-auto"
        onValueChange={onTimezoneChange}
        value={timezone}
      />
    </div>
  );
}
