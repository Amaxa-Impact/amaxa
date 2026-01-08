import React from "react";
import Link from "next/link";

import { Card, CardContent } from "@amaxa/ui/card";

import { ApplyButton } from "~/components/apply";
import { CohortTimeline } from "~/components/cohort-timeline";
import { DownloadBrochure } from "~/components/download-brochure";

export default function ProgramPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="w-full bg-background px-6 py-20 md:px-16 md:py-28 lg:px-20 lg:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-4xl font-semibold leading-tight text-transparent md:text-5xl lg:text-7xl">
            Ámaxa Cohorts
          </h1>

          {/* Green wavy line - centered below title */}
          <div className="mx-auto mt-4 h-6 w-48 md:mt-6 md:w-64">
            <svg
              viewBox="0 6 325 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full"
            >
              <path
                d="M1 41C1 41 54 10 81 41C108 72 162 10 189 41C216 72 270 41 270 41"
                stroke="#BCD96C"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <p className="mx-auto mt-8 max-w-3xl text-xl font-normal leading-relaxed text-muted-foreground md:mt-10 md:text-2xl lg:text-3xl">
            We believe high school students are capable of effecting change at a
            large scale.
          </p>

          <div className="mt-12 md:mt-16">
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4">
              <Card className="rounded-2xl border-border shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="mb-2 text-4xl font-bold text-brand-green">
                    100%
                  </div>
                  <p className="text-lg font-medium text-card-foreground">
                    Remote
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Accessible from anywhere
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="mb-2 text-4xl font-bold text-brand-green">
                    48+
                  </div>
                  <p className="text-lg font-medium text-card-foreground">
                    Countries
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Students worldwide
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="mb-2 text-4xl font-bold text-brand-green">
                    240+
                  </div>
                  <p className="text-lg font-medium text-card-foreground">
                    Students
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Making an impact
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-12 md:mt-16">
            <React.Suspense fallback={<div>Loading...</div>}>
              <ApplyButton variant="color">Apply Today →</ApplyButton>
            </React.Suspense>
          </div>
        </div>
      </section>

      <CohortTimeline />

      {/* What Makes Us Different */}
      <section className="w-full bg-accent px-6 py-16 md:px-16 md:py-24 lg:px-20 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-3xl font-normal text-foreground md:text-4xl lg:text-5xl">
            What makes us different?
          </h2>

          <p className="mb-16 max-w-4xl text-lg text-muted-foreground md:text-xl">
            We take you from "I wish I could" to "Here's how I did." To
            accomplish this, we spent the last two years iterating, improving,
            and learning. Here's some things we do different than everyone else:
          </p>

          <div className="space-y-16 md:space-y-24">
            <div className="flex flex-col gap-4 md:flex-row md:gap-8">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-brand-green md:h-10 md:w-10"
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
                <h3 className="mb-4 text-2xl font-normal text-foreground md:text-3xl">
                  We built an online platform designed to amplify the impact of
                  our teams.
                </h3>
                <p className="mb-6 max-w-3xl text-lg text-muted-foreground">
                  With each new cohort, we more precisely understand teams'
                  challenges, and over time, this data will fuel AI-driven
                  tools, giving each team lessons of all teams before them.
                </p>
                <a
                  href="/platform"
                  className="inline-flex items-center justify-center rounded-full bg-brand-green px-6 py-2 text-foreground transition-colors hover:bg-brand-green-hover"
                >
                  Learn more about our platform →
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:gap-8">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-brand-green md:h-10 md:w-10"
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
                <h3 className="mb-4 text-2xl font-normal text-foreground md:text-3xl">
                  We are accessible across income and location.
                </h3>
                <p className="mb-6 max-w-3xl text-lg text-muted-foreground">
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
                  className="inline-flex items-center justify-center rounded-full bg-brand-green px-6 py-2 text-foreground transition-colors hover:bg-brand-green-hover"
                >
                  Read more about our mission →
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:gap-8">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-brand-green md:h-10 md:w-10"
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
                <h3 className="mb-4 text-2xl font-normal text-foreground md:text-3xl">
                  We are more than a 'program'. We are a community.
                </h3>
                <p className="mb-6 max-w-3xl text-lg text-muted-foreground">
                  Members leave a cohort with friends around the world. Whether
                  becoming close to your team members and coach, or meeting
                  others through our remote events, ámaxa aims to forge
                  connections that last well beyond the 3 month project.
                </p>
                <a
                  href="/project-stories"
                  className="inline-flex items-center justify-center rounded-full bg-brand-green px-6 py-2 text-foreground transition-colors hover:bg-brand-green-hover"
                >
                  Read stories of our members →
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:gap-8">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-brand-green md:h-10 md:w-10"
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
                <h3 className="mb-4 text-2xl font-normal text-foreground md:text-3xl">
                  Our projects and initiatives are high-impact.
                </h3>
                <p className="mb-6 max-w-3xl text-lg text-muted-foreground">
                  Our projects are high-impact, innovative, and
                  community-driven. We have partnered with nonprofits in
                  Palestine, Liberia, and Uganda whose community-founded
                  solutions are innovative in their fields, such as ISNAD
                  Community Center's approach to community-based learning, the
                  first in its area, and the Nyaka School's holistic approach to
                  supporting AIDS-affected communities.
                </p>
                <p className="mb-6 max-w-3xl text-lg text-muted-foreground">
                  Where we spotted gaps in high-impact projects that our members
                  wanted to work on, we created our own. Led by Head of Programs
                  Alexi Jones, we have launched three new initiatives in 2024,
                  focusing on mental health, feminism, and LBGTQ+
                  representation.
                </p>
                <Link
                  href="/project"
                  className="inline-flex items-center justify-center rounded-full bg-brand-green px-6 py-2 text-foreground transition-colors hover:bg-brand-green-hover"
                >
                  Explore All Projects →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Stories CTA */}
      <section className="w-full bg-background py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-16 lg:px-20">
          <div className="mb-12 max-w-4xl md:mb-16 lg:mb-20 lg:max-w-5xl">
            <h2 className="text-3xl font-normal leading-tight text-foreground md:text-4xl lg:text-5xl xl:text-6xl">
              Read stories of past students to learn about the diverse types of
              projects cohorts undertake.
            </h2>
          </div>

          <div>
            <a
              href="/project-stories"
              className="inline-flex items-center justify-center rounded-full border border-border bg-card px-7 py-3 text-base text-foreground transition-colors hover:bg-accent md:text-lg"
            >
              Ámaxa Stories →
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full bg-accent px-6 py-16 md:px-16 md:py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 md:mb-16">
            <h2 className="text-3xl font-normal text-foreground md:text-4xl lg:text-5xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-12 md:space-y-16 lg:space-y-20">
            {/* What are cohorts? */}
            <div className="flex flex-col md:flex-row md:gap-8 lg:gap-16">
              <div className="mb-4 md:mb-0 md:w-1/3">
                <h3 className="text-2xl font-normal text-foreground md:text-3xl lg:text-4xl">
                  What are cohorts?
                </h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-lg font-normal leading-relaxed text-muted-foreground md:text-xl lg:text-2xl">
                  Through our 3-month remote program, you work in a remote team
                  of your peers, guided by a coach, to effect measurable change
                  through one of our 9 partner nonprofits or original
                  initiatives.
                </p>
              </div>
            </div>

            {/* Who can join? */}
            <div className="flex flex-col md:flex-row md:gap-8 lg:gap-16">
              <div className="mb-4 md:mb-0 md:w-1/3">
                <h3 className="text-2xl font-normal text-foreground md:text-3xl lg:text-4xl">
                  Who can join?
                </h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-lg font-normal leading-relaxed text-muted-foreground md:text-xl lg:text-2xl">
                  High school students aged 14-18, from anywhere in the world!
                </p>
              </div>
            </div>

            {/* Is there a cost? */}
            <div className="flex flex-col md:flex-row md:gap-8 lg:gap-16">
              <div className="mb-4 md:mb-0 md:w-1/3">
                <h3 className="text-2xl font-normal text-foreground md:text-3xl lg:text-4xl">
                  Is there a cost?
                </h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-lg font-normal leading-relaxed text-muted-foreground md:text-xl lg:text-2xl">
                  Members pay an annual fee of $150. We provide full and partial
                  scholarships to anyone in-need. After we receive funding, we
                  hope to lower or remove this fee altogether.
                </p>
              </div>
            </div>

            {/* What's the time commitment? */}
            <div className="flex flex-col md:flex-row md:gap-8 lg:gap-16">
              <div className="mb-4 md:mb-0 md:w-1/3">
                <h3 className="text-2xl font-normal text-foreground md:text-3xl lg:text-4xl">
                  What's the time commitment?
                </h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-lg font-normal leading-relaxed text-muted-foreground md:text-xl lg:text-2xl">
                  Cohorts meet remotely for about one hour each week for 3
                  months. You'll also spend time working on your project between
                  meetings. We estimate a total commitment of 3-5 hours per
                  week, flexible to fit your schedule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DownloadBrochure />

      {/* Final CTA */}
      <section className="w-full bg-background px-6 py-16 md:px-16 md:py-20 lg:px-20 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-semibold text-foreground md:text-4xl lg:text-5xl">
            Ready to make an impact?
          </h2>
          <p className="mb-10 text-lg text-muted-foreground md:text-xl">
            Join hundreds of high school students from around the world who are
            creating meaningful change through Ámaxa Cohorts.
          </p>
          <React.Suspense fallback={<div>Loading...</div>}>
            <ApplyButton variant="color">Apply Now →</ApplyButton>
          </React.Suspense>
        </div>
      </section>
    </main>
  );
}
