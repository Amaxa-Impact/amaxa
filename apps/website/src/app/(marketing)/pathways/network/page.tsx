"use client";

import React from "react";
import Link from "next/link";
import { FocusCards } from "@/components/ui/focus-cards-text";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@amaxa/ui/tabs";

import { ApplyButton } from "~/components/apply";

export default function ProgramPage() {
  return (
    <main>
      <div className="relative flex max-h-[360px] w-full flex-col bg-white px-6 sm:max-h-[240px] md:max-h-[320px] md:px-12 lg:px-20">
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
                  Ámaxa Network:{" "}
                  <span className="font-normal text-[#3B3B3B]">Colorado</span>
                </h1>
                {/* --- End of resolved conflict block --- */}

                {/* Green wavy line - SVG replacement for the image */}
                <div className="lg:w-200 relative -mt-2 ml-auto h-6 w-48 md:-mt-4 md:w-64">
                  {/* --- Start of resolved conflict block (SVG fixed) --- */}
                  <svg
                    viewBox="0 6 325 120" // Adjusted viewBox height
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full" // Ensure SVG scales
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

      <section className="w-full px-6 py-12 md:px-16 md:py-16 lg:px-20 lg:py-20">
        <div className="mx-auto max-w-7xl space-y-16 md:space-y-20">
          {/* High School Program */}
          <div className="space-y-8 md:space-y-10">
            <h2 className="text-3xl font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl">
              This is an open invitation for individuals in Colorado who are
              doing great things to effect change.
            </h2>
            <p className="text-lg font-normal leading-relaxed text-[#3B3B3B] md:text-xl lg:text-2xl">
              The Ámaxa Network provides a space to congregate both digitally &
              in-person, celebrate both big wins and small victories, and foster
              a sense of collective achievement. Here, accomplishments are not
              just noted; they're elevated, fueling inspiration and
              collaborative growth.
            </p>
            <p className="text-lg font-normal leading-relaxed text-[#3B3B3B] md:text-xl lg:text-2xl">
              Our core philosophy: every achievement, no matter how seemingly
              modest, contributes to a larger tapestry of social impact. In
              essence, the ámaxa network isn’t just about connectivity—it’s
              about building a legacy of excellence through shared efforts.
            </p>
            <p className="text-lg font-normal leading-relaxed text-[#3B3B3B] md:text-xl lg:text-2xl">
              {" "}
              Any Colorado-based applicant can apply today through our link
              below, and we will be in touch with next steps.
            </p>
          </div>
          <React.Suspense fallback={<div>Loading...</div>}>
            <ApplyButton variant="color">Apply Today →</ApplyButton>
          </React.Suspense>
        </div>
      </section>

      <section className="w-full px-6 py-12 md:px-16 md:py-16 lg:px-20 lg:py-20">
        <div className="mx-auto max-w-7xl space-y-16 md:space-y-20">
          {/* High School Program */}
          <div className="space-y-8 md:space-y-10">
            <h2 className="text-3xl font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl">
              As part of the network, you have access to opportunities to grow
              your skills and scale your personal project.
            </h2>

            <p className="text-lg font-light text-[#3B3B3B] md:text-xl lg:text-2xl">
              <strong>
                Feature Your Project on our Socials and Newsletters:
              </strong>{" "}
              <br></br> As part of the network, we will amplify the reach and
              visibility of your personal projects through our marketing
              channels.
            </p>

            <p className="text-lg font-light text-[#3B3B3B] md:text-xl lg:text-2xl">
              <strong>Write for our Newsletter as a Contributor:</strong>{" "}
              <br></br> Get a piece of your original writing published and
              'placed' in media. This is great for Linkedin!
            </p>

            <p className="text-lg font-light text-[#3B3B3B] md:text-xl lg:text-2xl">
              <strong>Internships in Computer Science:</strong> <br></br>We take
              a select number of students from the pool of our applicants who
              are exceptional at Computer Science and invite them to a 2-3 month
              internship where they work alongside our development team to gain
              real world experience building the ámaxa platform.
            </p>

            <p className="text-lg font-light text-[#3B3B3B] md:text-xl lg:text-2xl">
              <strong>Free Social Media Consulting</strong> <br></br> If you
              have a page for your project/initiative and would like an audit,
              the ámaxa PR and digital marketing team will do it for you for
              free (usually costs thousands).
            </p>

            <p className="text-lg font-light text-[#3B3B3B] md:text-xl lg:text-2xl">
              <strong>Awards</strong> <br></br> Once a year, we will review the
              network project prorfiles and select the most impactful or
              innovative. In addition to yearly awards, we will highlight
              projects on a quarterly basis.
            </p>

            <p className="text-lg font-light text-[#3B3B3B] md:text-xl lg:text-2xl">
              <strong>Events in the Denver Metro Area</strong> <br></br> Meet
              in-person with other passionate individuals in Colorado at meetups
              and larger events as the network grows.
            </p>
          </div>
          <React.Suspense fallback={<div>Loading...</div>}>
            <ApplyButton variant="color">Apply Today →</ApplyButton>
          </React.Suspense>
        </div>
      </section>

      {/* --- Start of resolved conflict block (main version kept - no commented section) --- */}
      <section className="w-full bg-[#F5F2F2] px-6 py-16 md:px-16 md:py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          {/* --- End of resolved conflict block --- */}

          <div className="space-y-12 md:space-y-16 lg:space-y-20">
            {/* What are cohorts? */}
            <div className="flex flex-col md:flex-row md:gap-8 lg:gap-16">
              <div className="mb-4 md:mb-0 md:w-1/3">
                <h2 className="text-3xl font-normal text-black md:text-4xl lg:text-5xl">
                  What is the network?
                </h2>
              </div>
              <div className="md:w-2/3">
                <p className="text-xl font-normal leading-snug text-[#3B3B3B] md:text-2xl lg:text-3xl">
                  A community of passionate individuals in Colorado actively
                  pursuring social impact projects or activities in their own
                  lives. As a part of the network, you have access to ámaxa's
                  digital platform & in-person events in Colorado.
                </p>
              </div>
            </div>

            {/* Who can join? */}
            <div className="flex flex-col md:flex-row md:gap-8 lg:gap-16">
              <div className="mb-4 md:mb-0 md:w-1/3">
                <h2 className="text-3xl font-normal text-black md:text-4xl lg:text-5xl">
                  Who can join?
                </h2>
              </div>
              <div className="md:w-2/3">
                <p className="text-xl font-normal leading-snug text-[#3B3B3B] md:text-2xl lg:text-3xl">
                  Anyone aged 14+ based in Colorado
                </p>
              </div>
            </div>

            {/* Is it remote? */}
            <div className="flex flex-col md:flex-row md:gap-8 lg:gap-16">
              <div className="mb-4 md:mb-0 md:w-1/3">
                <h2 className="text-3xl font-normal text-black md:text-4xl lg:text-5xl">
                  Is it remote or in-person?
                </h2>
              </div>
              <div className="md:w-2/3">
                <p className="text-xl font-normal leading-snug text-[#3B3B3B] md:text-2xl lg:text-3xl">
                  You can take part in the network both remotely via our online
                  platform and by attending in-person events and meetups.
                </p>
              </div>
            </div>

            {/* Is there a cost? */}
            <div className="flex flex-col md:flex-row md:gap-8 lg:gap-16">
              <div className="mb-4 md:mb-0 md:w-1/3">
                <h2 className="text-3xl font-normal text-black md:text-4xl lg:text-5xl">
                  Is there a cost?
                </h2>
              </div>
              <div className="md:w-2/3">
                <p className="text-xl font-normal leading-snug text-[#3B3B3B] md:text-2xl lg:text-3xl">
                  There is no cost to join.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#F5F2F2] py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-16 lg:px-20">
          <div className="mb-12 max-w-4xl md:mb-16 lg:mb-20 lg:max-w-5xl">
            <h2 className="text-3xl font-normal leading-tight text-[#3B3B3B] md:text-4xl lg:text-5xl xl:text-6xl">
              Read stories of past students to learn about the diverse types of
              projects cohorts undertake.
            </h2>
          </div>

          <div>
            {/* --- Start of resolved conflict block (main version kept) --- */}
            <a
              href="/project-stories"
              className="inline-flex items-center justify-center rounded-full border border-[#3B3B3B] bg-white px-7 py-3 text-base text-[#3B3B3B] transition-colors hover:bg-gray-50 md:text-lg"
            >
              Ámaxa Stories →
            </a>
            {/* --- End of resolved conflict block --- */}
          </div>
        </div>
      </section>
      <section className="w-full px-6 py-16 md:px-16 md:py-24 lg:px-20 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-3xl font-normal text-black md:text-4xl lg:text-5xl">
            What makes us different?
          </h2>

          <p className="mb-16 max-w-4xl text-lg md:text-xl">
            We take you from "I wish I could" to "Here's how I did." To
            accomplish this, we spent the last two years iterating, improving,
            and learning. Here's some things we do different than everyone else:
          </p>

          <div className="space-y-16 md:space-y-24">
            {/* Feature 1 */}
            <div className="flex flex-col gap-4 md:flex-row md:gap-8">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-[#BCD96C] md:h-10 md:w-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h3 className="mb-4 text-2xl font-normal text-[#3B3B3B] md:text-3xl">
                  We built an online platform designed to amplify the impact of
                  our teams.
                </h3>
                <p className="mb-6 max-w-3xl text-lg">
                  With each new cohort, we more precisely understand teams'
                  challenges, and over time, this data will fuel AI-driven
                  tools, giving each team lessons of all teams before them.
                </p>
                <a
                  href="/platform"
                  className="inline-flex items-center justify-center rounded-full bg-[#BCD96C] px-6 py-2 text-[#3B3B3B] transition-colors hover:bg-[#a9c55a]"
                >
                  Learn more about our platform →
                </a>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col gap-4 md:flex-row md:gap-8">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-[#BCD96C] md:h-10 md:w-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h3 className="mb-4 text-2xl font-normal text-[#3B3B3B] md:text-3xl">
                  We are accessible across income and location.
                </h3>
                <p className="mb-6 max-w-3xl text-lg">
                  The ability to effect change should not be limited by your
                  home or your income. That's why we strive to make our
                  community accessible and inclusive, so everyone who wants to
                  make an impact can join. Our cohorts are 100% remote, and we
                  offer scholarships to anyone who is unable to pay our annual
                  $150 membership fee. After we receive funding, we aim to
                  remove the fee altogether.
                </p>
                <a
                  href="/mission"
                  className="inline-flex items-center justify-center rounded-full bg-[#BCD96C] px-6 py-2 text-[#3B3B3B] transition-colors hover:bg-[#a9c55a]"
                >
                  Read more about our mission →
                </a>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col gap-4 md:flex-row md:gap-8">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-[#BCD96C] md:h-10 md:w-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h3 className="mb-4 text-2xl font-normal text-[#3B3B3B] md:text-3xl">
                  We are more than a 'program'. We are a community.
                </h3>
                <p className="mb-6 max-w-3xl text-lg">
                  Members leave a cohort with friends around the world. Whether
                  becoming close to your team members and coach, or meeting
                  others through our remote events, ámaxa aims to forge
                  connections that last well beyond the 3 month project.
                </p>
                {/* --- Start of resolved conflict block (main version kept) --- */}
                <a
                  href="/project-stories"
                  className="inline-flex items-center justify-center rounded-full bg-[#BCD96C] px-6 py-2 text-[#3B3B3B] transition-colors hover:bg-[#a9c55a]"
                >
                  Read stories of our members →
                </a>
                {/* --- End of resolved conflict block --- */}
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col gap-4 md:flex-row md:gap-8">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-[#BCD96C] md:h-10 md:w-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h3 className="mb-4 text-2xl font-normal text-[#3B3B3B] md:text-3xl">
                  Our projects and initiatives are high-impact.
                </h3>
                <p className="mb-6 max-w-3xl text-lg">
                  Our projects are high-impact, innovative, and
                  community-driven. We have partnered with nonprofits in
                  Palestine, Liberia, and Uganda whose community-founded
                  solutions are innovative in their fields, such as ISNAD
                  Community Center's approach to community-based learning, the
                  first in its area, and the Nyaka School's holistic approach to
                  supporting AIDS-affected communities.
                </p>
                <p className="mb-6 max-w-3xl text-lg">
                  Where we spotted gaps in high-impact projects that our members
                  wanted to work on, we created our own. Led by Head of Programs
                  Alexi Jones, we have launched three new initiatives in 2024,
                  focusing on mental health, feminism, and LBGTQ+
                  representation.
                </p>
                {/* --- Start of resolved conflict block (main version kept) --- */}
                <Link
                  href="/project"
                  className="inline-flex items-center justify-center rounded-full bg-[#BCD96C] px-6 py-2 text-[#3B3B3B] transition-colors hover:bg-[#a9c55a]"
                >
                  Explore All Projects →
                </Link>
                {/* --- End of resolved conflict block --- */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
