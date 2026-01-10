import { format, parse, parseISO } from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";

export function formatTimezone(tz: string | undefined): string {
  if (!tz) return "";
  return tz.split("/").pop()?.replace(/_/g, " ") ?? tz;
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  try {
    return format(parseISO(dateString), "eeee, MMMM d, yyyy");
  } catch {
    return dateString;
  }
}

export function formatTime(timeString: string | undefined): string {
  if (!timeString) return "";
  try {
    const date = parse(timeString, "HH:mm", new Date());
    return format(date, "h:mm a");
  } catch {
    return timeString;
  }
}

export function convertToEasternTime(
  dateStr: string,
  timeStr: string,
  userTimezone: string | undefined,
): string | null {
  if (!userTimezone) return null;
  try {
    // Create date object assuming the input is in the user's timezone
    const dateTimeStr = `${dateStr}T${timeStr}:00`;
    const date = toDate(dateTimeStr, { timeZone: userTimezone });

    return formatInTimeZone(
      date,
      "America/New_York",
      "MM/dd 'at' h:mm a 'ET'",
    );
  } catch {
    return null;
  }
}