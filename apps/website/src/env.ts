/* eslint-disable no-restricted-properties */
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    AIRTABLE_API_KEY: z.string().min(1).optional(),
    AIRTABLE_BASE_ID: z.string().min(1).optional(),
    AIRTABLE_TABLE_ID: z.string().min(1).optional(),
    AIRTABLE_TABLE_NAME: z.string().optional(),
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});





