"use client";

import { IconCheck } from "@tabler/icons-react";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { Card, CardContent } from "@/components/ui/card";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface SlotCardProps {
  slot: {
    _id: Id<"interviewTimeSlots">;
    startTime: number;
    endTime: number;
    timezone: string;
  };
  isSelected: boolean;
  onSelect: () => void;
  userTimezone: string;
}

export function SlotCard({
  slot,
  isSelected,
  onSelect,
  userTimezone,
}: SlotCardProps) {
  const startDate = new Date(slot.startTime);
  const endDate = new Date(slot.endTime);

  const formatTime = (date: Date) => {
    try {
      return formatInTimeZone(date, userTimezone, "h:mm a");
    } catch {
      return format(date, "h:mm a");
    }
  };

  const formatDate = (date: Date) => {
    try {
      return formatInTimeZone(date, userTimezone, "EEEE, MMMM d, yyyy");
    } catch {
      return format(date, "EEEE, MMMM d, yyyy");
    }
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:border-primary/50",
        isSelected && "border-primary ring-2 ring-primary/20"
      )}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex flex-col">
          <span className="font-medium">{formatDate(startDate)}</span>
          <span className="text-muted-foreground text-sm">
            {formatTime(startDate)} - {formatTime(endDate)}
          </span>
        </div>
        <div
          className={cn(
            "flex size-6 items-center justify-center rounded-full border-2 transition-colors",
            isSelected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/30"
          )}
        >
          {isSelected && <IconCheck className="size-4" />}
        </div>
      </CardContent>
    </Card>
  );
}
