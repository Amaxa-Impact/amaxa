"use client";

import React, { forwardRef, useRef } from "react";

import { BentoSectionLanding } from "./bento-landing";

export function BeamSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="pricing">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-8 px-4 py-14 md:px-8">
        <div className="mx-auto max-w-5xl text-center">
          {/* <h4 className="text-xl font-bold tracking-tight text-black dark:text-white">
            Pricing
          </h4> */}

          <h2 className="text-5xl font-bold tracking-tight text-black dark:text-white sm:text-6xl">
            Features that help you succeed
          </h2>

          <p className="mt-6 text-xl leading-8 text-black/80 dark:text-white">
            We work with you to understand your needs and build features that
            help you successed
          </p>
        </div>
      </div>

      <div className="container mb-14 mt-4 flex items-center justify-center px-4 md:px-6">
        <div
          className="relative flex w-full max-w-[1000px] items-center justify-center overflow-hidden rounded-lg bg-background md:shadow-xl"
          ref={containerRef}
        >
          <BentoSectionLanding />
        </div>
      </div>
    </section>
  );
}
