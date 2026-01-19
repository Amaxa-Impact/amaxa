/**
 * CohortTimeline - How cohorts work section with step cards
 *
 * Shows 4 steps in the cohort process:
 * 1. Apply
 * 2. Interview
 * 3. Get matched
 * 4. Meet weekly for 3 months
 */

import { FileText, Handshake, Users, Video } from "lucide-react";

const COHORT_STEPS = [
  {
    icon: FileText,
    number: "01",
    heading: "Apply to the next cohort",
    text: "Click on the application link to view the next cohort deadline.",
  },
  {
    icon: Users,
    number: "02",
    heading: "Attend an interview",
    text: "Tell us about your interests, availability, and which projects excite you most.",
  },
  {
    icon: Handshake,
    number: "03",
    heading: "Get matched to a team",
    text: "We match you to a project you're passionate about with a team that meets at times that work for you.",
  },
  {
    icon: Video,
    number: "04",
    heading: "Meet weekly for 3 months",
    text: "One-hour weekly meetings with your coach guiding you through planning, problem solving, and execution.",
  },
];

export function CohortTimeline() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-12 lg:py-28">
        <div className="mb-12 md:mb-16">
          <h2 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
            How Cohorts Work
          </h2>
          <div className="bg-brand-green mt-4 h-1 w-16 rounded-full" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {COHORT_STEPS.map((step) => {
            const StepIcon = step.icon;

            return (
              <div
                key={step.number}
                className="border-border bg-card group rounded-xl border p-6 transition-shadow hover:shadow-md"
              >
                <div className="bg-brand-green mb-5 flex h-12 w-12 items-center justify-center rounded-xl">
                  <StepIcon className="text-foreground h-6 w-6" />
                </div>

                <p className="text-brand-green text-sm font-bold tracking-wider">
                  STEP {step.number}
                </p>

                <h3 className="text-foreground mt-2 text-lg leading-snug font-semibold">
                  {step.heading}
                </h3>

                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {step.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
