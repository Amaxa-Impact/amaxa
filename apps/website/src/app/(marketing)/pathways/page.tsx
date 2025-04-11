"use client";

import React from "react";
import Link from "next/link";
import { FocusCards } from "@/components/ui/focus-cards-text";
import { ApplyButton } from "~/components/apply";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@amaxa/ui/tabs";

export const cards = [
  {
    title: "Ámaxa Cohorts",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOQI4SoEOsmkEelahd1WSuvzRG6jICN9HqcOF3",
    link: "/cohorts",
    description: "for high school students",
  },
  {
    title: "Ámaxa Research",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOVscvGzWL0MYRHUetxwcyzJn3h7alsSdIDAKf",
    link: "/research",
    description: "for undergrad & postgrad students",
  },
  {
    title: "Ámaxa Partnerships",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToO1yec3BZuh38756znQ1WsobkyBqTCiLE0ramM",
    link: "/partnerships",
    description: "for professionals",
  },
  {
    title: "Ámaxa Network",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOaVg3qCIBDGmcbISEzQYZx81iL0rWJ43h2T9d",
    link: "/network",
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
                            Our community provides ways for people of all ages and interests to effect real change.
                          </h3>
                         
                          {/* <a
                            href="/projects"
                            className="inline-flex items-center justify-center px-6 py-2 bg-[#BCD96C] rounded-full text-[#3B3B3B] hover:bg-[#a9c55a] transition-colors"
                          >
                            Explore All Projects →
                          </a>  */}
                          <p className="mb-6 max-w-3xl text-lg">
                            {" "}
                            <strong>Hover or click</strong> below to explore the pathway right for you.
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
      <section className="w-full bg-[#F5F2F2] px-6 py-16 md:px-16 md:py-20 lg:px-20">
        
        <div className="mx-auto max-w-7xl">
          {/* --- End of resolved conflict block --- */}

          <div className="space-y-12 md:space-y-16 lg:space-y-20">
            {/* What are cohorts? */}
            <div className="flex flex-col md:flex-row md:gap-8 lg:gap-16">
              <div className="mb-4 md:mb-0 md:w-1/3">
                <h2 className="text-3xl font-normal text-black md:text-4xl lg:text-5xl">
                  What are cohorts?
                </h2>
              </div>
              <div className="md:w-2/3">
                <p className="text-xl font-normal leading-snug text-[#3B3B3B] md:text-2xl lg:text-3xl">
                  Through our 3-month remote program, you work in a remote team
                  of your peers, guided by a coach, to effect measurable change
                  through one of our 10 partner nonprofits or ámaxa original
                  initiatives.
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
                  High school students, college students, and anyone beyond!
                </p>
              </div>
            </div>

            {/* Is it remote? */}
            <div className="flex flex-col md:flex-row md:gap-8 lg:gap-16">
              <div className="mb-4 md:mb-0 md:w-1/3">
                <h2 className="text-3xl font-normal text-black md:text-4xl lg:text-5xl">
                  Is it remote?
                </h2>
              </div>
              <div className="md:w-2/3">
                <p className="text-xl font-normal leading-snug text-[#3B3B3B] md:text-2xl lg:text-3xl">
                  Cohorts are 100% remote.
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
                  Members pay an annual fee of $150. We provide full and partial
                  scholarships to anyone in-need. After we receive funding, we
                  hope to lower or remove this fee altogether.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-6 py-12 md:px-16 md:py-16 lg:px-20 lg:py-20">
        <div className="mx-auto max-w-7xl space-y-16 md:space-y-20">
          {/* High School Program */}
          <div className="space-y-8 md:space-y-10">
            <h2 className="text-3xl font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl">
              Ámaxa High School
            </h2>

            <p className="text-lg font-normal leading-relaxed text-[#3B3B3B] md:text-xl lg:text-2xl">
              We believe high school students are capable of effecting change at
              a large scale. Our high school cohorts match you to a team of
              students from ages 14-18 from across the world, guided by a
              trained undergraduate coach. More than 180 students have applied
              from 48 countries and counting.
            </p>

            <div>
              <React.Suspense fallback={<div>Loading...</div>}>
                <ApplyButton variant="color">
                  Apply to Ámaxa High School →
                </ApplyButton>
              </React.Suspense>
            </div>
          </div>

          {/* College & Professionals Program */}
          <div className="space-y-8 md:space-y-10">
            <h2 className="text-3xl font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl">
              Ámaxa College & Professionals
            </h2>

            <p className="text-lg font-normal leading-relaxed text-[#3B3B3B] md:text-xl lg:text-2xl">
              We believe our model of effecting change through remote project
              meetings with peers and a coach, aided by fine-tuned project
              management methodologies and custom-built online tools, allows
              anyone to effect change. Apply to our 2025 cohort today.
            </p>

            <div>
              <React.Suspense fallback={<div>Loading...</div>}>
                <ApplyButton variant="black">
                  Apply to Ámaxa College & Professionals →
                </ApplyButton>
              </React.Suspense>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#F5F2F2] py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-16 lg:px-20">
          <h2 className="mb-12 text-3xl font-normal text-[#3B3B3B] md:mb-16 md:text-4xl lg:text-5xl">
            How Cohorts Work
          </h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute bottom-0 left-4 top-0 w-px bg-black md:left-6"></div>

            {/* Timeline steps */}
            <div className="space-y-16 md:space-y-20">
              {/* Step 1 */}
              <div className="relative pl-16 md:pl-20">
                {/* Circle */}
                <div className="absolute left-0 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-black bg-[#F4FFD6]">
                  <span className="sr-only">Step 1</span>
                </div>

                <h3 className="mb-4 text-xl font-normal text-black md:text-2xl lg:text-3xl">
                  Apply to the next cohort.
                </h3>

                <p className="text-lg font-normal leading-relaxed text-[#3B3B3B] md:text-xl lg:text-2xl">
                  We offer cohorts for high school students, college students,
                  and professionals.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative pl-16 md:pl-20">
                {/* Circle */}
                <div className="absolute left-0 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-black bg-[#C8D998]">
                  <span className="sr-only">Step 2</span>
                </div>

                <h3 className="mb-4 text-xl font-normal text-black md:text-2xl lg:text-3xl">
                  Attend an interview.
                </h3>

                <p className="text-lg font-normal leading-relaxed text-[#3B3B3B] md:text-xl lg:text-2xl">
                  Tell us more about your interests, time availability, and
                  projects or initiatives you're most interested in.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative pl-16 md:pl-20">
                {/* Circle */}
                <div className="absolute left-0 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-black bg-[#BCD96C]">
                  <span className="sr-only">Step 3</span>
                </div>

                <h3 className="mb-4 text-xl font-normal text-black md:text-2xl lg:text-3xl">
                  We match you to a project, team, and coach!
                </h3>

                <p className="text-lg font-normal leading-relaxed text-[#3B3B3B] md:text-xl lg:text-2xl">
                  We aim to match you to a project you are passionate about with
                  a team that meets in a time that you indicated works for you
                  consistently.
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative pl-16 md:pl-20">
                {/* Circle */}
                <div className="absolute left-0 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-black bg-[#94AB55]">
                  <span className="sr-only">Step 4</span>
                </div>

                <h3 className="mb-4 text-xl font-normal text-black md:text-2xl lg:text-3xl">
                  Meet remotely with your team{" "}
                  <span className="font-semibold">weekly</span> for{" "}
                  <span className="font-semibold">3 months</span>.
                </h3>

                <p className="text-lg font-normal leading-relaxed text-[#3B3B3B] md:text-xl lg:text-2xl">
                  Meetings last about one hour each week. Your coach will guide
                  you in the project management methodologies designed
                  specifically for our cohorts. Each meeting, coaches will lead
                  you in planning, brainstorming, status checks, problem
                  solving, and more.
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
              Read stories of past members to learn about the diverse types of
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
