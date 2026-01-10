"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";
import { Button } from "@amaxa/ui/button";

import { CalendarPlaceholder } from "./_components/calendar-placeholder";
import { ConfirmationView } from "./_components/confirmation-view";
import { SlotCard } from "./_components/slot-card";
import { TimezoneDisplay } from "./_components/timezone-display";

interface ScheduleClientProps {
  token: string;
}

export default function ScheduleClient({ token }: ScheduleClientProps) {
  const [selectedSlotId, setSelectedSlotId] =
    useState<Id<"interviewTimeSlots"> | null>(null);
  const [userTimezone, setUserTimezone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "America/New_York";
    }
  });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    success: boolean;
    message: string;
    bookedSlot?: {
      startTime: number;
      endTime: number;
    };
  } | null>(null);

  const data = useQuery(api.interviewTimeSlots.listAvailableByToken, { token });
  const bookSlot = useMutation(api.interviewTimeSlots.book);

  if (data === undefined) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading...</div>
      </div>
    );
  }

  if (data === null) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-md px-4 text-center">
          <h1 className="text-2xl font-semibold">Invalid Link</h1>
          <p className="text-muted-foreground mt-2">
            This scheduling link is invalid or has expired. Please contact the
            team for a new link.
          </p>
        </div>
      </div>
    );
  }

  if (data.alreadyBooked && data.bookedSlot) {
    return (
      <ConfirmationView
        applicantName={data.applicantName}
        endTime={data.bookedSlot.endTime}
        formTitle={data.formTitle}
        startTime={data.bookedSlot.startTime}
        timezone={userTimezone}
      />
    );
  }

  if (bookingResult?.success) {
    const selectedSlot = data.slots.find((s) => s._id === selectedSlotId);
    return (
      <ConfirmationView
        applicantName={data.applicantName}
        endTime={selectedSlot?.endTime ?? 0}
        formTitle={data.formTitle}
        startTime={selectedSlot?.startTime ?? 0}
        timezone={userTimezone}
      />
    );
  }

  const handleBook = async () => {
    if (!selectedSlotId) {
      return;
    }

    setIsBooking(true);
    try {
      const result = await bookSlot({ token, slotId: selectedSlotId });
      setBookingResult(result);
    } catch (error) {
      setBookingResult({
        success: false,
        message: error instanceof Error ? error.message : "Failed to book slot",
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold">Schedule Your Interview</h1>
          <p className="text-muted-foreground mt-2">
            Hi {data.applicantName}, please select a time slot for your
            interview for{" "}
            <span className="text-foreground font-medium">
              {data.formTitle}
            </span>
            .
          </p>
        </div>

        <TimezoneDisplay
          onTimezoneChange={setUserTimezone}
          timezone={userTimezone}
        />

        {bookingResult && !bookingResult.success && (
          <div className="border-destructive/50 bg-destructive/10 mb-4 rounded-lg border p-4">
            <p className="text-destructive text-sm">{bookingResult.message}</p>
          </div>
        )}

        {data.slots.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">
              No available time slots at the moment. Please check back later or
              contact the team.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 space-y-3">
              {data.slots.map((slot) => (
                <SlotCard
                  isSelected={selectedSlotId === slot._id}
                  key={slot._id}
                  onSelect={() => setSelectedSlotId(slot._id)}
                  slot={slot}
                  userTimezone={userTimezone}
                />
              ))}
            </div>

            <Button
              className="w-full"
              disabled={!selectedSlotId || isBooking}
              onClick={handleBook}
              size="lg"
            >
              {isBooking ? "Booking..." : "Confirm Selection"}
            </Button>
          </>
        )}

        <CalendarPlaceholder />
      </div>
    </div>
  );
}
