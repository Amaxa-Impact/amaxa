"use client";

import { FileText, Users, Handshake, Video } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@amaxa/ui/card";

const COHORT_STEPS = [
  {
    icon: FileText,
    number: "Step 1",
    heading: "Apply to the next cohort.",
    text: "Click on the application link to view the next cohort deadline.",
  },
  {
    icon: Users,
    number: "Step 2",
    heading: "Attend an interview.",
    text: "Tell us more about your interests, time availability, & projects or initiatives you're most interested in.",
  },
  {
    icon: Handshake,
    number: "Step 3",
    heading: "We match you to a project, team, and coach!",
    text: "We aim to match you to a project you are passionate about with a team that meets in a time that you indicated works for you consistently.",
  },
  {
    icon: Video,
    number: "Step 4",
    heading: "Meet remotely with your team weekly for 3 months.",
    text: "Meetings last about one hour each week. Your coach will guide you in the project management methodologies designed specifically for our cohorts. Each meeting, coaches will lead you in planning, brainstorming, status checks, problem solving, and more.",
  },
];

export function CohortTimeline() {
  const steps = [];

  for (const step of COHORT_STEPS) {
    const StepIcon = step.icon;

    steps.push(
      <Card
        key={step.number}
        className="rounded-2xl transition-shadow hover:shadow-md"
      >
        <CardHeader>
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-green">
            <StepIcon className="h-8 w-8 text-foreground" />
          </div>
          <CardTitle className="text-xl lg:text-2xl">{step.number}</CardTitle>
          <CardTitle className="text-lg font-semibold">
            {step.heading}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm leading-relaxed lg:text-base">
            {step.text}
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="w-full bg-background py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-16 lg:px-20">
        <div className="mb-12 md:mb-16">
          <h2 className="bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-3xl font-semibold text-transparent md:text-4xl lg:text-5xl">
            How Cohorts Work
          </h2>
          <div className="mt-4 h-1 w-24 rounded-full bg-brand-green" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps}
        </div>
      </div>
    </section>
  );
}
