"use client";

import React from "react";

import { AnimatedTitle } from "~/components/animated-underline";

export function TitleSection() {
  return (
    <section className="w-full overflow-visible py-16 md:py-24">
      <div className="container mx-auto overflow-visible px-6 md:px-16 lg:px-20">
        <div className="flex flex-col items-center justify-center overflow-visible">
          <div className="mb-12 max-w-full overflow-visible">
            <AnimatedTitle underlinedText="Mission & Team" color="#BCD96C" />
          </div>
        </div>
      </div>
    </section>
  );
}
