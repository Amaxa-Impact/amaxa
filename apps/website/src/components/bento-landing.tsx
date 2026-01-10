import { BellIcon, BrainIcon, MapIcon, Share2Icon } from "lucide-react";

import { cn } from "@amaxa/ui";

import { AnimatedListLanding } from "./animated-list-landing";
import { BentoCard, BentoGrid } from "./ui/bento-grid";
import Marquee from "./ui/marquee";

const files = [
  {
    name: "goal update",
    body: "20% of the project's fundraising goal reached!",
  },
  {
    name: "goal update",
    body: "Your work has been seen by 1000 people!",
  },
  {
    name: "environmental impact",
    body: "50 tons of CO2 emissions reduced through our initiatives",
  },
  {
    name: "education outreach",
    body: "200 students received free coding workshops this quarter",
  },
  {
    name: "community engagement",
    body: "30% increase in volunteer participation compared to last year",
  },
];

const features = [
  {
    Icon: MapIcon,
    name: "Quantify Impact",
    description:
      "Quantify what you do with real numbers. Feel and see the progress your making",
    href: "",
    cta: "",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] [--duration:20s]"
      >
        {files.map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none",
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white">
                  {f.name}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-xs">{f.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: BrainIcon,
    name: "Knowledge",
    description:
      "We have information from hundreds of cohorts on what works and doesn't for things like fundrasing, projects vision and more",
    href: "",
    cta: "",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute left-4 h-[300px] w-full bg-[url('/guides-ss.png')] bg-cover object-fill"></div>
    ),
  },
  {
    Icon: Share2Icon,
    name: "Project Managment",
    description:
      "after observing hundreds of teams, we've created a project managment system that streamlines the experience of our cohort members",
    href: "",
    cta: "",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute left-4 h-[300px] w-full bg-[url('/flowchart.png')] bg-cover object-fill"></div>
    ),
  },
  {
    Icon: BellIcon,
    name: "Stay Connected",
    description: "Stay connected with team members from across the globe",
    className: "col-span-3 lg:col-span-1",
    href: "",
    cta: "",
    background: (
      <AnimatedListLanding className="absolute top-4 right-2 h-[300px] w-[600px] border-none [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-105 md:h-[150px] md:w-[300px]" />
    ),
  },
];

export function BentoSectionLanding() {
  return (
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  );
}
