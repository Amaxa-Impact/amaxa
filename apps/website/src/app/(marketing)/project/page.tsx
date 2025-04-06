"use client";

import React from "react";
import { FocusCards } from "@/components/ui/focus-cards";

import { ApplyButton } from "~/components/apply";
import { projects } from "~/lib/constants/projects"; // Assuming this is the correct import for projects

export default function Page() {
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
                <h1 className="text-3xl font-light leading-tight text-[#3B3B3B] md:text-4xl lg:text-6xl">
                  Discover{" "}
                  <span className="font-normal text-[#3B3B3B]">
                    Our Projects
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
                    Our projects are high-impact, innovative, and
                    community-driven.
                  </h3>
                  <p className="mb-6 max-w-3xl text-lg">
                    We have partnered with nonprofits in Palestine, Liberia, and
                    Uganda whose{" "}
                    <strong>
                      community-founded solutions are innovative in their fields
                    </strong>
                    , and where we spotted gaps in high-impact projects that our
                    members wanted to work on, we launched original initiatives
                    focusing on{" "}
                    <strong>
                      mental health, feminism, and LBGTQ+ representation.
                    </strong>
                  </p>
                  {/* <a
                    href="/projects"
                    className="inline-flex items-center justify-center px-6 py-2 bg-[#BCD96C] rounded-full text-[#3B3B3B] hover:bg-[#a9c55a] transition-colors"
                  >
                    Explore All Projects →
                  </a>  */}
                  <p className="mb-6 max-w-3xl text-lg">
                    {" "}
                    <strong>Hover or click</strong> below to discover each
                    project.
                  </p>
                </div>
              </div>

              {/* Ensure 'projects' data is correctly passed */}
              <FocusCards cards={projects} />
            </div>
          </section>
        </div>
      </section>
      <section className="bg-[#F5F2F2] py-16 md:py-24 lg:py-32">
        <div className="px-6 md:px-16 lg:px-20">
          {/* Main heading */}
          <h2 className="mb-12 max-w-5xl text-3xl font-normal leading-tight text-[#3B3B3B] md:mb-16 md:text-4xl lg:text-5xl">
            Join us to transform your passion into impact.
          </h2>

          {/* Button */}
          <ApplyButton variant="black">Apply Today</ApplyButton>
          {/* <button ="https://airtable.com/appPR9mkslbn3U8YZ/shrHHUtRzK4DqKt3F" className="box-border flex justify-center items-center py-3 px-6 bg-white border border-[#3B3B3B] rounded-full">
            <span className="font-normal text-base md:text-lg text-[#3B3B3B]" >
              Apply Today →
            </span>
          </button> */}
        </div>
      </section>

      {/* FOCUS CARDS */}
    </main>
  );
}
