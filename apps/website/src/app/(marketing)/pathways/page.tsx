"use client";

import React from "react";
import Link from "next/link";
import { FocusCards } from "@/components/ui/focus-cards-text";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@amaxa/ui/tabs";

import { ApplyButton } from "~/components/apply";

export const cards = [
  {
    title: "Ámaxa Cohorts",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOQI4SoEOsmkEelahd1WSuvzRG6jICN9HqcOF3",
    link: "/pathways/cohorts",
    description: "for high school students",
  },
  {
    title: "Ámaxa Research",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOVscvGzWL0MYRHUetxwcyzJn3h7alsSdIDAKf",
    link: "/pathways/research",
    description: "for undergrad & postgrad students",
  },
  {
    title: "Ámaxa Partnerships",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToO1yec3BZuh38756znQ1WsobkyBqTCiLE0ramM",
    link: "/pathways/partnerships",
    description: "for professionals",
  },
  {
    title: "Ámaxa Network",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOaVg3qCIBDGmcbISEzQYZx81iL0rWJ43h2T9d",
    link: "/pathways/network",
    description: "for students & professionals in Colorado",
  },
];

export default function ProgramPage() {
  return (
    <main>
      <div className="relative flex max-h-[320px] w-full flex-col bg-white px-6 sm:max-h-[240px] md:max-h-[320px] md:px-12 lg:px-20">
        {/* Background container - hidden but preserved for reference */}
        <div className="invisible absolute inset-0">
          <div
            className="h-full w-full"
            style={{ background: "url(/Untitled design.png)" }}
          />
        </div>
        {/* Content container with flex layout */}
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-6 md:px-16 lg:px-20">
            <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
              <div className="mb-12 max-w-full md:mb-0 md:max-w-3xl lg:max-w-4xl">
                {/* --- Start of resolved conflict block (main version kept) --- */}
                <h1 className="text-4xl font-light leading-tight text-[#3B3B3B] md:text-4xl lg:text-6xl">
                  Explore{" "}
                  <span className="font-normal text-[#3B3B3B]">
                    Our Pathways
                  </span>
                </h1>
                {/* --- End of resolved conflict block --- */}

                {/* Green wavy line - SVG replacement for the image */}
                <div className="lg:w-200 relative -mt-2 ml-auto h-6 w-48 md:-mt-4 md:w-64">
                  {/* --- Start of resolved conflict block (SVG fixed) --- */}
                  <svg
                    viewBox="0 0 325 50" // Adjusted viewBox height
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-full w-full" // Ensure SVG scales
                  >
                    <path
                      d="M1 41C1 41 54 10 81 41C108 72 162 10 189 41C216 72 270 41 270 41"
                      stroke="#BCD96C"
                      strokeWidth="8"
                      strokeLinecap="round" // Moved inside path tag
                    />
                  </svg>
                  {/* --- End of resolved conflict block --- */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="container mx-auto flex flex-col">
        <div className="flex flex-col gap-10 py-10 text-[#3B3B3B]">
          <section className="w-full px-6 md:px-16 lg:px-20">
            <div className="mx-auto max-w-7xl">
              <div className="space-y-16 md:space-y-24">
                <div>
                  <h3 className="mb-4 text-2xl font-normal text-[#3B3B3B] md:text-3xl">
                    Our community provides ways for people of all ages and
                    interests to effect real change.
                  </h3>

                  {/* <a
                            href="/projects"
                            className="inline-flex items-center justify-center px-6 py-2 bg-[#BCD96C] rounded-full text-[#3B3B3B] hover:bg-[#a9c55a] transition-colors"
                          >
                            Explore All Projects →
                          </a>  */}
                  <p className="mb-6 max-w-3xl text-lg">
                    {" "}
                    <strong>Hover or click</strong> below to explore the pathway
                    right for you.
                  </p>
                </div>
              </div>

              {/* Ensure 'projects' data is correctly passed */}
              <FocusCards cards={cards} />
            </div>
          </section>
        </div>
      </section>

      {/* --- Start of resolved conflict block (main version kept - no commented section) --- */}
    </main>
  );
}
