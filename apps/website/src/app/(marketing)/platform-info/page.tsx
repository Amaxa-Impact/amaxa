"use client";

import React from "react";
import Image from "next/image";

import { ApplyButton } from "~/components/apply";

export default function PlatformPage() {
  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 text-[#3B3B3B] md:px-16 lg:px-20">
        <div className="mb-8">
          <h1 className="mb-4 max-w-4xl text-4xl font-light leading-tight md:text-5xl lg:text-6xl">
            A Personalized Platform for{" "}
            <span className="relative inline-block font-normal">
              Making Impact
              {/* Green wavy line underneath */}
              <div className="absolute -bottom-2 left-0 h-4 w-full md:-bottom-3">
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
            </span>
          </h1>
          <p className="mb-8 max-w-3xl text-lg text-neutral-600">
            Explore our platform which we've spent hundreds of hours crafting to
            amplify what you can achieve.
          </p>
          <ApplyButton variant="black">Apply now</ApplyButton>
        </div>
      </section>

      {/* Platform Screenshot */}
      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-16 lg:px-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-100 to-neutral-50 p-4 shadow-xl md:p-8">
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-neutral-900">
            <Image
              src="/platform-dashboard.png"
              alt="Platform dashboard overview"
              width={1200}
              height={675}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Intro */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-16 lg:px-20">
        <h2 className="mb-4 max-w-5xl text-3xl font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl">
          Features that help you succeed
        </h2>
        <p className="mb-12 max-w-3xl text-lg text-neutral-600">
          We work with you to understand your needs and build features that help
          you succeed.
        </p>
      </section>

      {/* Feature Cards Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-16 lg:px-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {/* Quantify Impact Feature */}
          <div className="group overflow-hidden rounded-3xl bg-[#F5F2F2] p-8 transition-all hover:shadow-xl">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white">
              <svg
                className="h-10 w-10 text-[#3B3B3B]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-2xl font-semibold text-[#3B3B3B]">
              Quantify Impact
            </h3>
            <p className="leading-relaxed text-neutral-600">
              Quantify what you do with real numbers. Feel and see the progress
              you're making with metrics like trees planted, students supported,
              or 50 tons of CO2 sequestered.
            </p>
          </div>

          {/* Knowledge Feature */}
          <div className="group overflow-hidden rounded-3xl bg-[#F5F2F2] p-8 transition-all hover:shadow-xl">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white">
              <svg
                className="h-10 w-10 text-[#3B3B3B]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-2xl font-semibold text-[#3B3B3B]">
              Knowledge
            </h3>
            <p className="leading-relaxed text-neutral-600">
              We have information from hundreds of cohorts on what works and
              doesn't for things like fundraising, project vision, and more.
              Access action guides tailored to your project's needs.
            </p>
          </div>

          {/* Project Management Feature */}
          <div className="group overflow-hidden rounded-3xl bg-[#F5F2F2] p-8 transition-all hover:shadow-xl">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white">
              <svg
                className="h-10 w-10 text-[#3B3B3B]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-2xl font-semibold text-[#3B3B3B]">
              Project Management
            </h3>
            <p className="leading-relaxed text-neutral-600">
              After observing hundreds of teams, we've created a project
              management system that streamlines the experience of our cohort
              members. Track tasks, milestones, and team progress all in one
              place.
            </p>
          </div>

          {/* Stay Connected Feature */}
          <div className="group overflow-hidden rounded-3xl bg-[#F5F2F2] p-8 transition-all hover:shadow-xl">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white">
              <svg
                className="h-10 w-10 text-[#3B3B3B]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-2xl font-semibold text-[#3B3B3B]">
              Stay Connected
            </h3>
            <p className="leading-relaxed text-neutral-600">
              Stay connected with team members from across the globe. Receive
              notifications, share updates, and collaborate seamlessly no matter
              where you are.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Visuals Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-16 lg:px-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left: Project Management Visual */}
          <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-lg">
            <div className="mb-6">
              <h3 className="mb-2 text-2xl font-semibold text-[#3B3B3B]">
                Visualize Your Project Journey
              </h3>
              <p className="text-neutral-600">
                See your project's path from idea to impact with our interactive
                project mapping tool.
              </p>
            </div>
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-neutral-100">
              <Image
                src="/project-flow.png"
                alt="Project flow visualization"
                width={600}
                height={400}
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          {/* Right: Notifications */}
          <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-lg">
            <div className="mb-6">
              <h3 className="mb-2 text-2xl font-semibold text-[#3B3B3B]">
                Real-Time Updates
              </h3>
              <p className="text-neutral-600">
                Never miss a beat with instant notifications and progress
                updates from your team.
              </p>
            </div>
            <div className="space-y-4">
              {/* Sample Notifications */}
              <div className="flex items-start gap-4 rounded-2xl bg-[#F5F2F2] p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-pink-500">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#3B3B3B]">
                    Message <span className="text-neutral-500">• 5m ago</span>
                  </p>
                  <p className="text-sm text-neutral-600">
                    Alex just sent you a message
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl bg-[#F5F2F2] p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#3B3B3B]">
                    Progress Update{" "}
                    <span className="text-neutral-500">• 10m ago</span>
                  </p>
                  <p className="text-sm text-neutral-600">
                    Anna just finished all her tasks!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl bg-[#F5F2F2] p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#3B3B3B]">
                    Milestone Reached{" "}
                    <span className="text-neutral-500">• 1h ago</span>
                  </p>
                  <p className="text-sm text-neutral-600">
                    Your team completed the fundraising goal!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#F5F2F2] py-16 md:py-24 lg:py-32">
        <div className="px-6 md:px-16 lg:px-20">
          <h2 className="mb-12 max-w-5xl text-3xl font-normal leading-tight text-[#3B3B3B] md:text-4xl lg:text-5xl">
            Ready to make an impact with our platform?
          </h2>
          <div className="flex flex-wrap gap-4">
            <ApplyButton variant="black">Apply Today</ApplyButton>
            <ApplyButton variant="black">Learn More</ApplyButton>
          </div>
        </div>
      </section>
    </main>
  );
}
