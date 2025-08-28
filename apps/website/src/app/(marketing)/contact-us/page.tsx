"use client";

import React, { useEffect } from "react";
import Image from "next/image";

import { ApplyButton } from "~/components/apply";

export default function ProgramPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://substack.com/embedjs/embed.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);
  }, []);

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
                <h1 className="text-4xl font-light leading-tight text-[#3B3B3B] md:text-4xl lg:text-6xl">
                  Contact Us{" "}
                </h1>

                {/* Green wavy line - SVG replacement for the image */}
                <div className="lg:w-200 relative -mt-2 ml-auto h-6 w-48 md:-mt-4 md:w-64">
                  <svg
                    viewBox="0 0 325 500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className=""
                  >
                    <path
                      d="M1 41C1 41 54 10 81 41C108 72 162 10 189 41C216 72 270 41 270 41"
                      stroke="#BCD96C"
                      strokeWidth="8"
                    />
                    strokeLinecap="round"
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="w-full px-6 py-12 md:px-16 md:py-16 lg:px-20 lg:py-20">
        <div className="mx-auto max-w-7xl space-y-16 md:space-y-20">
          {/* High School Program */}
          <div className="space-y-8 md:space-y-10">
            <div className="flex flex-col md:flex-row md:items-center md:gap-12">
              {/* Left: Description */}
              <div className="w-full space-y-6 md:w-1/2">
                <h2 className="text-3xl font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl">
                  Questions, comments, or partnership proposals? We've love to
                  hear from you.
                </h2>
                <p className="text-lg font-normal leading-relaxed text-[#3B3B3B] md:text-xl lg:text-2xl">
                  For general inquiries, please email our CEO Lauren McMillen at
                  lauren@amaxaimpact.org.
                </p>

                <p className="text-lg font-normal leading-relaxed text-[#3B3B3B] md:text-xl lg:text-2xl">
                  For collaboration inquiries, please email our COO Alexi Jones
                  at lexi@amaxaimpact.org.
                </p>

                {/* <div>
          <React.Suspense fallback={<div>Loading...</div>}>
            <ApplyButton variant="color">
            Check out This Month's Edition →
            </ApplyButton>
          </React.Suspense>
        </div> */}
              </div>

              {/* Right: Image instead of Substack Embed */}
              <div className="mt-8 flex w-full items-center justify-center md:mt-0 md:w-1/2">
                <div className="h-auto w-auto">
                  <Image
                    src="https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToO8nKnqPHgjXRpn0dgo1l6KOV2DuqGLya94cMI" // replace with your image path
                    alt="mail"
                    width="300"
                    height="300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
