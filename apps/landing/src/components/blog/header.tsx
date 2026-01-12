"use client";

import { AnimatedHeading } from "@/components/custom-animations/animated-heading";

export function BlogHeader() {
  return (
    <div className="mb-16 text-center">
      <AnimatedHeading
        text="Ámaxa - Insights & Inspiration"
        className="text-foreground mx-auto mb-6 max-w-5xl text-4xl leading-tight font-semibold md:text-5xl lg:text-6xl"
      />

      <p className="text-muted-foreground mx-auto max-w-4xl text-lg leading-relaxed md:text-xl">
        Explore articles on youth-led change, global issues, and projects making
        a real impact.
      </p>
    </div>
  );
}
