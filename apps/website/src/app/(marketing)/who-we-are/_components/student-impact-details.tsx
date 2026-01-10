"use client";

import React from "react";
import Link from "next/link";
import { LinkPreview } from "@/components/ui/link-preview";

export function StudentImpactDetails() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-6 py-8 md:px-16 lg:px-20">
      <p className="max-w-3xl text-lg text-neutral-500 md:text-xl dark:text-neutral-400">
        Created an
        <LinkPreview
          url="https://tailwindcss.com"
          className="bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent"
        >
          educational platform
        </LinkPreview>{" "}
        for the ISNAD Center in Palestine.
      </p>

      <p className="max-w-3xl text-lg text-neutral-500 md:text-xl dark:text-neutral-400">
        Raised $700 for Gazans through
        <LinkPreview
          url="https://tailwindcss.com"
          className="bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent"
        >
          a benefit concert in Georgia, USA
        </LinkPreview>{" "}
        and
        <LinkPreview
          url="https://tailwindcss.com"
          className="bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent"
        >
          a basketball tournament in Doha, Qatar
        </LinkPreview>
        .
      </p>

      <p className="max-w-3xl text-lg text-neutral-500 md:text-xl dark:text-neutral-400">
        Paid
        <LinkPreview
          url="https://tailwindcss.com"
          className="bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent"
        >
          full year tuition for 7 students in Liberia
        </LinkPreview>{" "}
        through
        <LinkPreview
          url="https://tailwindcss.com"
          className="bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent"
        >
          a martial arts tournament and bake sale
        </LinkPreview>
        .
      </p>

      <p className="max-w-3xl text-lg text-neutral-500 md:text-xl dark:text-neutral-400">
        Raised $500 for
        <LinkPreview
          url="https://tailwindcss.com"
          className="bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent"
        >
          medical supplies for Ukrainian citizens
        </LinkPreview>
        .
      </p>

      <p className="max-w-3xl text-lg text-neutral-500 md:text-xl dark:text-neutral-400">
        We are providing PR for artist Piera van de Wiel to promote a
        <LinkPreview
          url="https://tailwindcss.com"
          className="bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent"
        >
          documentary on LGBTQ+ refugees
        </LinkPreview>
        .
      </p>

      <p className="max-w-3xl text-lg text-neutral-500 md:text-xl dark:text-neutral-400">
        Creating educational and cultural remote exchanges for
        <LinkPreview
          url="https://tailwindcss.com"
          className="bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent"
        >
          high school girls in the West Bank, Palestine
        </LinkPreview>{" "}
        with other students from around the globe.
      </p>
    </div>
  );
}
