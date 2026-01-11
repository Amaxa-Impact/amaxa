"use client";

import { IconCalendarCheck, IconCheck } from "@tabler/icons-react";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

import { Card, CardContent } from "@amaxa/ui/card";

interface ConfirmationViewProps {
  applicantName: string;
  formTitle: string;
  startTime: number;
  endTime: number;
  timezone: string;
}

export function ConfirmationView({
  applicantName,
  formTitle,
  startTime,
  endTime,
  timezone,
}: ConfirmationViewProps) {
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  const formatTime = (date: Date) => {
    try {
      return formatInTimeZone(date, timezone, "h:mm a");
    } catch {
      return format(date, "h:mm a");
    }
  };

  const formatDate = (date: Date) => {
    try {
      return formatInTimeZone(date, timezone, "EEEE, MMMM d, yyyy");
    } catch {
      return format(date, "EEEE, MMMM d, yyyy");
    }
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <IconCheck className="size-8 text-green-600 dark:text-green-400" />
        </div>

        <h1 className="text-2xl font-semibold">Interview Scheduled!</h1>
        <p className="text-muted-foreground mt-2">
          Thanks {applicantName}, your interview for{" "}
          <span className="text-foreground font-medium">{formTitle}</span> has
          been confirmed.
        </p>

        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                <IconCalendarCheck className="text-primary size-5" />
              </div>
              <div className="text-left">
                <p className="font-medium">{formatDate(startDate)}</p>
                <p className="text-muted-foreground text-sm">
                  {formatTime(startDate)} - {formatTime(endDate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-muted-foreground mt-6 text-sm">
          You will receive more details via email. If you need to reschedule,
          please contact the team.
        </p>
      </div>
    </div>
  );
}
