"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@amaxa/ui/button";

import { ApplyButton } from "./apply-button";

export default function Hero() {
  return (
    <motion.section className="relative flex flex-row  items-center gap-20 md:min-h-[375px]">
      <div className="hero-slide-up flex flex-col">
        {" "}
        <h1 className="animate-fade-in mt-6 translate-y-[-1rem] text-[30px] font-bold leading-none md:text-[80px] md:font-semibold">
          {" "}
          We help you effect
          <br /> change in the world.
        </h1>
        <p className="animate-fade-in mt-4 max-w-[600px] text-[#878787] md:mt-6">
          We connect high school students, college students, professionals, &
          retirees to high-impact projects with our 9 global partner nonprofits.
        </p>
        <div className="animate-fade-in mt-8">
          <div className="flex items-center space-x-4">
            <Link href="/about-us">
              <Button
                variant="outline"
                className="h-12 border border-primary px-6"
              >
                Learn How
              </Button>
            </Link>

            <ApplyButton />
          </div>
        </div>
        <p className="mt-8 font-mono text-xs text-[#707070]">
          Trusted by over{" "}
          <Link href="/open-startup" prefetch>
            <span className="underline">150</span>
          </Link>{" "}
          students from over <span className="underline">45</span> countries.
        </p>
      </div>
    </motion.section>
  );
}
