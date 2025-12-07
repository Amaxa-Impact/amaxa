/* eslint-disable @typescript-eslint/no-non-null-assertion */
import posthog from 'posthog-js'
import { env } from 'process';

posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: env.NEXT_PUBLIC_POSTHOG_HOST!,
  defaults: '2025-11-30'
});