"use client";

import React from "react";
import { ColourfulText } from "@/components/ui/colourful-text";
import { motion } from "motion/react";

export function MissionImageSection() {
  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="relative flex h-[600px] w-full items-center justify-center overflow-hidden bg-black">
        <motion.img
          src="https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOexh9L5yvrS3NH5LD0fGBOXwFydpiVbYzJMa1"
          className="pointer-events-none absolute inset-0 h-full w-full [mask-image:radial-gradient(circle,transparent,black_80%)] object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
        />
        <h1 className="relative z-2 w-[1000px] text-center text-4xl font-bold text-white">
          Àmaxa's mission is to make it easier for people who want to make a
          difference to <ColourfulText text="actually take action" /> — not just
          feel stuck in that "I want to help, but I don't know how" feeling.
        </h1>
      </div>
    </section>
  );
}
