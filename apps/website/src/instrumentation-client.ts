/* eslint-disable @typescript-eslint/no-non-null-assertion */
import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
  defaults: "2025-11-30",
  person_profiles: "always",
});

