"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

import { env } from "~/env";

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  const hasInitializedRef = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize on client side only once
    if (
      typeof window !== "undefined" &&
      env.NEXT_PUBLIC_POSTHOG_KEY &&
      !hasInitializedRef.current
    ) {
      posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: env.NEXT_PUBLIC_POSTHOG_HOST ?? "/ingest",
        person_profiles: "always",
      });
      hasInitializedRef.current = true;
      // Use RAF to defer state update
      requestAnimationFrame(() => setIsReady(true));
    }
  }, []);

  if (!isReady && typeof window !== "undefined") {
    return <>{children}</>;
  }

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
