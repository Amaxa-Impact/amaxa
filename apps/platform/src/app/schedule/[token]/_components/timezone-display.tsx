"use client";

import {
  formatTimezoneDisplay,
  TimezoneSelect,
} from "@/components/scheduling/timezone-select";
import { IconGlobe } from "@tabler/icons-react";

interface TimezoneDisplayProps {
  timezone: string;
  onTimezoneChange: (timezone: string) => void;
}

export function TimezoneDisplay({
  timezone,
  onTimezoneChange,
}: TimezoneDisplayProps) {
  return (
    <div className="bg-muted/30 mb-6 flex items-center justify-between rounded-lg border p-3">
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
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
