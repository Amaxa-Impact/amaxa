"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@amaxa/ui/select";

const COMMON_TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)", offset: "UTC-5" },
  { value: "America/Chicago", label: "Central Time (CT)", offset: "UTC-6" },
  { value: "America/Denver", label: "Mountain Time (MT)", offset: "UTC-7" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)", offset: "UTC-8" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)", offset: "UTC-9" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)", offset: "UTC-10" },
  { value: "Europe/London", label: "London (GMT)", offset: "UTC+0" },
  { value: "Europe/Paris", label: "Paris (CET)", offset: "UTC+1" },
  { value: "Europe/Berlin", label: "Berlin (CET)", offset: "UTC+1" },
  { value: "Asia/Dubai", label: "Dubai (GST)", offset: "UTC+4" },
  { value: "Asia/Kolkata", label: "India (IST)", offset: "UTC+5:30" },
  { value: "Asia/Singapore", label: "Singapore (SGT)", offset: "UTC+8" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)", offset: "UTC+9" },
  { value: "Australia/Sydney", label: "Sydney (AEST)", offset: "UTC+10" },
];

interface TimezoneSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function getDefaultTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "America/New_York";
  }
}

export function formatTimezoneDisplay(timezone: string): string {
  const found = COMMON_TIMEZONES.find((tz) => tz.value === timezone);
  if (found) {
    return `${found.label} (${found.offset})`;
  }
  return timezone;
}

export function TimezoneSelect({
  value,
  onValueChange,
  className,
}: TimezoneSelectProps) {
  const userTimezone = getDefaultTimezone();
  const isUserTimezoneInList = COMMON_TIMEZONES.some(
    (tz) => tz.value === userTimezone
  );

  return (
    <Select
      onValueChange={(newValue) => {
        if (newValue) {
          onValueChange(newValue);
        }
      }}
      value={value}
    >
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {!isUserTimezoneInList && userTimezone && (
          <SelectGroup>
            <SelectLabel>Your Timezone</SelectLabel>
            <SelectItem value={userTimezone}>{userTimezone}</SelectItem>
          </SelectGroup>
        )}
        <SelectGroup>
          <SelectLabel>Americas</SelectLabel>
          {COMMON_TIMEZONES.filter((tz) => tz.value.startsWith("America/")).map(
            (tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            )
          )}
          {COMMON_TIMEZONES.filter((tz) => tz.value.startsWith("Pacific/")).map(
            (tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            )
          )}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          {COMMON_TIMEZONES.filter((tz) => tz.value.startsWith("Europe/")).map(
            (tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            )
          )}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Asia & Pacific</SelectLabel>
          {COMMON_TIMEZONES.filter(
            (tz) =>
              tz.value.startsWith("Asia/") || tz.value.startsWith("Australia/")
          ).map((tz) => (
            <SelectItem key={tz.value} value={tz.value}>
              {tz.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
