"use client";

import React from "react";
import { ColourfulText } from "@/components/ui/colourful-text";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 text-[#3B3B3B] md:px-16 lg:px-20">
      <div className="relative flex h-[400px] w-full items-center justify-center overflow-hidden bg-black">
        <h1 className="relative z-10 max-w-4xl px-6 text-left text-3xl font-bold text-white">
          Àmaxa's mission is to make it easier for people who want to make a
          difference to <ColourfulText text="actually take action" /> — not just
          feel stuck in that "I want to help, but I don't know how" feeling.
        </h1>
      </div>
    </section>
  );
}
