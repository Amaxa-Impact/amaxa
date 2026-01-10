import { addHours } from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";
import type { ContactFormData } from "../types";
import {
  convertToEasternTime,
  formatDate,
  formatTime,
  formatTimezone,
} from "./formatting";

const GOOGLE_UTC_FORMAT = "yyyyMMdd'T'HHmmss'Z'";

export function generateCalendarLink(
  formData: ContactFormData,
  referenceId: string,
): string | null {
  const { formType, preferredDate, preferredTime, timezone, name, email } =
    formData;

  if (formType !== "demo" || !preferredDate || !preferredTime) {
    return null;
  }

  try {
    const userTz = timezone ?? "America/New_York";
    const dateTimeStr = `${preferredDate}T${preferredTime}:00`;

    const startDate = toDate(dateTimeStr, { timeZone: userTz });
    const endDate = addHours(startDate, 1);

    const startTime = formatInTimeZone(startDate, "UTC", GOOGLE_UTC_FORMAT);
    const endTime = formatInTimeZone(endDate, "UTC", GOOGLE_UTC_FORMAT);

    const userTimeStr = `${formatDate(preferredDate)} at ${formatTime(
      preferredTime,
    )}`;
    const etTimeStr = convertToEasternTime(preferredDate, preferredTime, userTz);

    const eventDetails = [
      `Reference ID: ${referenceId}`,
      `Demo/Intro Call Request\n`,
      name,
      email,
      formData.phone,
      formData.organization ? `Organization: ${formData.organization}` : null,
      `\nPreferred Time:`,
      `${userTimeStr} (${formatTimezone(userTz)})`,
      etTimeStr ? `${etTimeStr}` : null,
      `\n${name.split(" ")[0]}'s Message:\n\n${formData.message}`,
    ]
      .filter(Boolean)
      .join("\n");

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `ámaxa Demo/Intro Call - ${name}`,
      dates: `${startTime}/${endTime}`,
      details: eventDetails,
      add: email,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  } catch {
    return null;
  }
}