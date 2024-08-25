"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@amaxa/ui/button";

export default function Hero() {
  return (
    <motion.section className="relative items-center md:min-h-[375px]">
      <div className="hero-slide-up flex flex-col">
        {" "}
        <h1 className="mt-6 text-[30px] font-semibold leading-none md:text-[80px]">
          {" "}
          We help you effect
          <br /> change in the world.
        </h1>
        <p className="mt-4 max-w-[600px] text-[#878787] md:mt-6">
          We connect high school students, college students, professionals, &
          retirees to high-impact projects with our 9 global partner nonprofits.
        </p>
        <div className="mt-8">
          <div className="flex items-center space-x-4">
            <Link href="">
              <Button
                variant="outline"
                className="h-12 border border-primary px-6"
              >
                Learn How
              </Button>
            </Link>

            <a href="/apply">
              <Button className="h-12 px-5">Apply Now</Button>
            </a>
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

      <div className="absolute right-10 top-10 h-auto w-auto scale-50 md:right-10 md:top-10 md:flex md:scale-100"></div>
    </motion.section>
  );
}
