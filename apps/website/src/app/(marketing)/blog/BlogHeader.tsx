"use client";

import { AnimatedHeading } from "@/components/AnimatedHeading";

export function BlogHeader() {
  return (
    <div className="mb-16 text-center">
      <div className="mb-8 inline-block">
        <span className="inline-block rounded-xl border-2 border-border bg-card px-6 py-2 text-sm font-semibold tracking-wider text-foreground shadow-sm">
          BLOGS
        </span>
      </div>

      <AnimatedHeading
        text="Ámaxa - Insights & Inspiration"
        className="mx-auto mb-6 max-w-5xl text-4xl font-semibold leading-tight text-foreground md:text-5xl lg:text-6xl"
      />

      <p className="mx-auto max-w-4xl text-lg leading-relaxed text-muted-foreground md:text-xl">
        Explore articles on youth-led change, global issues, and projects making
        a real impact.
      </p>
    </div>
  );
}
