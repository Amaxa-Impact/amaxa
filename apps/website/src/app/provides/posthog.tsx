/* eslint-disable no-restricted-properties */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
//@ts-nocheck
"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "anonymous", // or 'always' to create profiles for anonymous users as well
    capture_pageleave: true, // Enable pageleave capture
  });
}
export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
