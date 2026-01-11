/* eslint-disable no-restricted-properties */
import { createEnv } from "@t3-oss/env-nextjs";
import { type } from "arktype";

const optionalString = type("(string > 1) | undefined");
export const env = createEnv({
  server: {
    AIRTABLE_API_KEY: optionalString,
    AIRTABLE_BASE_ID: optionalString,
    AIRTABLE_TABLE_ID: optionalString,
    AIRTABLE_TABLE_NAME: optionalString,
    RESEND_FROM_EMAIL: optionalString,
  },
  client: {
    NEXT_PUBLIC_POSTHOG_KEY: optionalString,
    NEXT_PUBLIC_POSTHOG_HOST: optionalString,
  },
  // Next.js only statically analyzes client-side `process.env` reads.
  experimental__runtimeEnv: {
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
