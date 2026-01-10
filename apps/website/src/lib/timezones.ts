/**
 * Comprehensive timezone list with user-friendly labels
 * Organized by region for better UX
 */

export interface TimezoneOption {
  value: string;
  label: string;
  region?: string;
}

export const timezones: TimezoneOption[] = [
  // Americas - US & Canada
  { value: "America/New_York", label: "Eastern Time (ET)", region: "Americas" },
  { value: "America/Chicago", label: "Central Time (CT)", region: "Americas" },
  { value: "America/Denver", label: "Mountain Time (MT)", region: "Americas" },
  {
    value: "America/Los_Angeles",
    label: "Pacific Time (PT)",
    region: "Americas",
  },
  { value: "America/Phoenix", label: "Arizona Time (MST)", region: "Americas" },
  {
    value: "America/Anchorage",
    label: "Alaska Time (AKT)",
    region: "Americas",
  },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HST)", region: "Americas" },
  { value: "America/Toronto", label: "Toronto (ET)", region: "Americas" },
  { value: "America/Vancouver", label: "Vancouver (PT)", region: "Americas" },
  {
    value: "America/Mexico_City",
    label: "Mexico City (CST)",
    region: "Americas",
  },
  { value: "America/Sao_Paulo", label: "São Paulo (BRT)", region: "Americas" },
  {
    value: "America/Buenos_Aires",
    label: "Buenos Aires (ART)",
    region: "Americas",
  },

  // Europe - UK & Major Cities
  { value: "Europe/London", label: "London (GMT/BST)", region: "Europe" },
  { value: "Europe/Dublin", label: "Dublin (GMT/IST)", region: "Europe" },
  { value: "Europe/Paris", label: "Paris (CET)", region: "Europe" },
  { value: "Europe/Berlin", label: "Berlin (CET)", region: "Europe" },
  { value: "Europe/Madrid", label: "Madrid (CET)", region: "Europe" },
  { value: "Europe/Rome", label: "Rome (CET)", region: "Europe" },
  { value: "Europe/Amsterdam", label: "Amsterdam (CET)", region: "Europe" },
  { value: "Europe/Brussels", label: "Brussels (CET)", region: "Europe" },
  { value: "Europe/Vienna", label: "Vienna (CET)", region: "Europe" },
  { value: "Europe/Zurich", label: "Zurich (CET)", region: "Europe" },
  { value: "Europe/Stockholm", label: "Stockholm (CET)", region: "Europe" },
  { value: "Europe/Oslo", label: "Oslo (CET)", region: "Europe" },
  { value: "Europe/Copenhagen", label: "Copenhagen (CET)", region: "Europe" },
  { value: "Europe/Helsinki", label: "Helsinki (EET)", region: "Europe" },
  { value: "Europe/Warsaw", label: "Warsaw (CET)", region: "Europe" },
  { value: "Europe/Prague", label: "Prague (CET)", region: "Europe" },
  { value: "Europe/Budapest", label: "Budapest (CET)", region: "Europe" },
  { value: "Europe/Athens", label: "Athens (EET)", region: "Europe" },
  { value: "Europe/Lisbon", label: "Lisbon (WET)", region: "Europe" },
  { value: "Europe/Moscow", label: "Moscow (MSK)", region: "Europe" },
  { value: "Europe/Istanbul", label: "Istanbul (TRT)", region: "Europe" },

  // Asia - Major Cities
  { value: "Asia/Dubai", label: "Dubai (GST)", region: "Asia" },
  { value: "Asia/Riyadh", label: "Riyadh (AST)", region: "Asia" },
  { value: "Asia/Karachi", label: "Karachi (PKT)", region: "Asia" },
  { value: "Asia/Kolkata", label: "Mumbai/New Delhi (IST)", region: "Asia" },
  { value: "Asia/Dhaka", label: "Dhaka (BST)", region: "Asia" },
  { value: "Asia/Bangkok", label: "Bangkok (ICT)", region: "Asia" },
  { value: "Asia/Singapore", label: "Singapore (SGT)", region: "Asia" },
  { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur (MYT)", region: "Asia" },
  { value: "Asia/Jakarta", label: "Jakarta (WIB)", region: "Asia" },
  { value: "Asia/Manila", label: "Manila (PHT)", region: "Asia" },
  { value: "Asia/Hong_Kong", label: "Hong Kong (HKT)", region: "Asia" },
  { value: "Asia/Shanghai", label: "Shanghai/Beijing (CST)", region: "Asia" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)", region: "Asia" },
  { value: "Asia/Seoul", label: "Seoul (KST)", region: "Asia" },
  { value: "Asia/Taipei", label: "Taipei (CST)", region: "Asia" },

  // Oceania
  { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)", region: "Oceania" },
  {
    value: "Australia/Melbourne",
    label: "Melbourne (AEST/AEDT)",
    region: "Oceania",
  },
  { value: "Australia/Brisbane", label: "Brisbane (AEST)", region: "Oceania" },
  { value: "Australia/Perth", label: "Perth (AWST)", region: "Oceania" },
  {
    value: "Australia/Adelaide",
    label: "Adelaide (ACST/ACDT)",
    region: "Oceania",
  },
  {
    value: "Pacific/Auckland",
    label: "Auckland (NZST/NZDT)",
    region: "Oceania",
  },
  { value: "Pacific/Fiji", label: "Fiji (FJT)", region: "Oceania" },

  // Africa - Major Cities
  {
    value: "Africa/Johannesburg",
    label: "Johannesburg (SAST)",
    region: "Africa",
  },
  { value: "Africa/Cairo", label: "Cairo (EET)", region: "Africa" },
  { value: "Africa/Lagos", label: "Lagos (WAT)", region: "Africa" },
  { value: "Africa/Nairobi", label: "Nairobi (EAT)", region: "Africa" },
  { value: "Africa/Casablanca", label: "Casablanca (WET)", region: "Africa" },

  // UTC
  { value: "UTC", label: "UTC (Coordinated Universal Time)", region: "UTC" },
];

/**
 * Get timezone label by value
 */
export function getTimezoneLabel(value: string): string {
  const tz = timezones.find((tz) => tz.value === value);
  return tz?.label || value;
}

/**
 * Format timezone for display in emails/UI
 * Maps IANA timezone identifiers to user-friendly names
 */
export function formatTimezone(tz: string | undefined): string {
  if (!tz) return "";

  const tzOption = timezones.find((t) => t.value === tz);
  if (tzOption) {
    // Extract just the timezone name without the abbreviation in parentheses for cleaner display
    return tzOption.label;
  }

  // Fallback: try to format the IANA identifier nicely
  return tz.split("/").pop()?.replace(/_/g, " ") || tz;
}

/**
 * Get timezones grouped by region
 */
export function getTimezonesByRegion(): Record<string, TimezoneOption[]> {
  return timezones.reduce(
    (acc, tz) => {
      const region = tz.region || "Other";
      if (!acc[region]) {
        acc[region] = [];
      }
      acc[region].push(tz);
      return acc;
    },
    {} as Record<string, TimezoneOption[]>,
  );
}
