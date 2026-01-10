"use client";

import React from "react";

import { ApplyButton } from "~/components/apply";

export function VisionCTASection() {
  return (
    <section className="bg-[#F5F2F2] py-16 md:py-24 lg:py-32">
      <div className="px-6 md:px-16 lg:px-20">
        <h2 className="mb-12 max-w-5xl text-3xl leading-tight font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl">
          Join us in our vision of 10,000 ámaxa members by 2030.
        </h2>
        <div className="flex flex-wrap gap-4">
          <ApplyButton variant="black">Contact Us</ApplyButton>
          <ApplyButton variant="black">Support Us</ApplyButton>
        </div>
      </div>
    </section>
  );
}
