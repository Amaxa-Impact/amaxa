"use client";

import React from "react";
import Link from "next/link";
import Script from "next/script"; // Import the Script component

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
                <h1 className="text-4xl font-light leading-tight text-[#3B3B3B] md:text-4xl lg:text-6xl">
                  Our newsletter rocks.{" "}
                  <span className="text-2xl text-[#3B3B3B]">(seriously.)</span>
                </h1>

                {/* Green wavy line - SVG replacement for the image */}
                <div className="lg:w-200 relative -mt-2 ml-auto h-6 w-48 md:-mt-4 md:w-64">
                  <svg
                    viewBox="0 0 325 50" // Adjusted viewBox height based on path
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-full w-full" // Ensure SVG scales
                  >
                    <path
                      d="M1 41C1 41 54 10 81 41C108 72 162 10 189 41C216 72 270 41 270 41"
                      stroke="#BCD96C"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="w-full px-6 py-12 md:px-16 md:py-16 lg:px-20 lg:py-20">
        <div className="mx-auto max-w-7xl space-y-16 md:space-y-20">
          {/* Ámaxa Monthly Newsletter */}
          <div className="space-y-8 md:space-y-10">
            <div className="flex flex-col md:flex-row md:items-center md:gap-12">
              {/* Left: Description */}
              <div className="w-full space-y-6 md:w-1/2">
                <h2 className="text-3xl font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl">
                  Ámaxa Monthly Newsletter
                </h2>
                <p className="text-lg font-normal leading-relaxed text-[#3B3B3B] md:text-xl lg:text-2xl">
                  The ámaxa monthly newsletter is your go-to for staying up to
                  date on all things ámaxa. Content ranges from project and
                  cohort updates, to student written columns and executive
                  insights written by the leadership team. Bottom line: the
                  newsletter is designed to give you a personal look at what is
                  going on in ámaxa-world each month.
                </p>

                <div>
                  {/* Using Link for navigation */}
                  <Link
                    href="https://amaxaimpact.substack.com/subscribe?utm_source=email&utm_campaign=email-subscribe&r=1qhobc&next=https%3A%2F%2Famaxaimpact.substack.com%2Fp%2Fmarch-preview&utm_medium=email"
                    className="inline-block rounded bg-[#BCD96C] px-5 py-3 text-lg font-medium text-[#3B3B3B] transition hover:bg-opacity-80" // Example styling matching ApplyButton
                    target="_blank" // Open in new tab
                    rel="noopener noreferrer" // Security best practice
                  >
                    Subscribe Now →
                  </Link>
                </div>
              </div>

              {/* Right: Substack Embed */}
              <div className="mt-8 w-full md:mt-0 md:w-1/2">
                <div className="substack-post-embed rounded-xl bg-white p-6 shadow-md">
                  <p className="text-xl font-semibold">
                    March Preview... by Ámaxa
                  </p>
                  <p className="mt-2 text-gray-700">
                    popcorn, new funding team, ambassadors in action
                  </p>
                  <a
                    href="https://amaxaimpact.substack.com/p/march-preview"
                    className="mt-4 inline-block text-blue-600 underline hover:text-blue-800"
                    data-post-link
                  >
                    Read on Substack
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Culture & Cause Newsletter */}
          <div className="space-y-8 md:space-y-10">
            <div className="flex flex-col md:flex-row md:items-center md:gap-12">
              {/* Left: Description */}
              <div className="w-full space-y-6 md:w-1/2">
                <h2 className="text-3xl font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl">
                  Culture & Cause
                </h2>
                <p className="text-lg font-normal leading-relaxed text-[#3B3B3B] md:text-xl lg:text-2xl">
                  Culture & Cause is ámaxa’s second newsletter written by
                  Isabella Benice and Alexi Jones, members of ámaxa’s marketing
                  and communications team. This newsletter was born out of our
                  recognition that the pop culture and media we consume seeps
                  into our consciousness and impacts how we see the world, even
                  if we don’t always realize it. Pop culture has always been
                  used to catalyze change, and since changemaking is what ámaxa
                  is all about, it only makes sense that we pay attention to it.
                  Each of these newsletters is sectioned off in the same way and
                  lands in your inbox on the 15th of each month.
                </p>

                <p className="text-lg font-normal leading-relaxed text-[#3B3B3B] md:text-xl lg:text-2xl">
                  We hope it makes you think, smile, and if nothing else, gives
                  you some interesting things to listen to and read over your
                  upcoming weeks. Enjoy!
                </p>

                <p className="text-sm font-light font-normal leading-relaxed text-[#3B3B3B] md:text-sm lg:text-sm">
                  P.S. Anyone can submit questions, essays, poems etc to Culture
                  & Cause, so if you consider yourself a creative, shoot an
                  email to lexi@amaxaimpact.org with a pitch/draft/piece!
                </p>

                <div>
                  {/* Using Link for navigation */}
                  <Link
                    href="https://amaxaimpact.substack.com/subscribe?utm_source=email&utm_campaign=email-subscribe&r=1qhobc&next=https%3A%2F%2Famaxaimpact.substack.com%2Fp%2Fmarch-preview&utm_medium=email" // TODO: Update this link if Culture & Cause has a different subscribe link
                    className="inline-block rounded bg-[#BCD96C] px-5 py-3 text-lg font-medium text-[#3B3B3B] transition hover:bg-opacity-80" // Example styling matching ApplyButton
                    target="_blank" // Open in new tab
                    rel="noopener noreferrer" // Security best practice
                  >
                    Subscribe Now →
                  </Link>
                </div>
              </div>

              {/* Right: Substack Embed */}
              <div className="mt-8 w-full md:mt-0 md:w-1/2">
                {/* TODO: Update this embed if needed for Culture & Cause */}
                <div className="substack-post-embed rounded-xl bg-white p-6 shadow-md">
                  <p className="text-xl font-semibold">
                    join the burnt out club!!❤️‍🔥 by Ámaxa
                  </p>
                  <p className="mt-2 text-gray-700">
                    plus Valentino, Navy SEALS, grad school, and Mickey 17
                  </p>
                  <a
                    href="https://amaxaimpact.substack.com/p/join-the-burnt-out-club"
                    className="mt-4 inline-block text-blue-600 underline hover:text-blue-800"
                    data-post-link
                  >
                    Read on Substack
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add the Next.js Script component here */}
      {/* 'afterInteractive' strategy loads the script after the page becomes interactive. */}
      <Script
        src="https://substack.com/embedjs/embed.js"
        strategy="afterInteractive"
        async
      />
    </main>
  );
}
