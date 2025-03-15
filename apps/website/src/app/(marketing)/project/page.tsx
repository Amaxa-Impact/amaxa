"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { BlurImage } from "~/components/ui/apple-cards";
import { projects } from "./projects";

const ProjectCard = ({
  project,
}: {
  project: {
    id: string;
    title: string;
    image: string;
  };
}) => {
  return (
    <Link
      className="flex h-screen w-full flex-col items-start"
      href={`/project/${project.id}`}
    >
      <motion.div className="relative z-10 flex h-56 w-full flex-row items-start justify-start overflow-hidden rounded-3xl bg-gray-100 dark:bg-neutral-900 md:h-80">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-30 w-1/4 bg-[#3B3B3B]" />
        <div className="relative z-40 flex h-full flex-col justify-center p-8">
          <motion.p className="mt-2 max-w-xs text-left font-sans text-xl font-semibold text-white [text-wrap:balance] md:text-3xl">
            {project.title}
          </motion.p>
        </div>
        <div className="relative h-full w-full">
          <BlurImage
            src={project.image}
            alt={project.image}
            fill
            className="object-cover"
          />
        </div>
      </motion.div>
    </Link>
  );
};

export default function Page() {
  return (
    <main>
      <section>
        <div className="relative w-full min-h-[400px] bg-[#F5F2F2] flex flex-col px-6 md:px-12 lg:px-20">


          {/* Content container with flex layout */}
          <div className="flex flex-col justify-center h-full w-full relative z-10 pt-10 ">
            {/* Main heading - centered on mobile, left-aligned on larger screens */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
              <h1 className="text-[40px] md:text-[50px] lg:text-[60px] leading-tight text-[#3B3B3B] font-normal mb-12 md:mb-0">
                Projects
              </h1>
            </div>

            {/* Apply now link - positioned at bottom right on larger screens */}
            <div className="flex justify-end mt-8 md:mt-16 lg:mt-24">
              <Link
                href="/apply"
                className="font-normal text-[32px] md:text-[40px] lg:text-[48px] leading-tight text-black hover:opacity-80 transition-opacity"
              >
                Apply now →
              </Link> </div>
          </div>
        </div>
      </section>


      <section className="container mx-auto flex flex-col">
        <div className="text-[#3B3B3B] flex flex-col gap-10 py-10">
          <p className="max-w-7xl">
            Our projects and initiatives are high-impact. Our projects are high-impact, innovative, and community-driven. We have partnered with nonprofits in Palestine, Liberia, and Uganda whose community-founded solutions are innovative in their fields, such as ISNAD Community Center's approach to community-based learning, the first in its area, and the Nyaka School's holistic approach to supporting AIDS-affected communities.
          </p>
          <p className="max-w-7xl">
            Where we spotted gaps in high-impact projects that our members wanted to work on, we created our own. Led by Head of Programs Alexi Jones, we have launched three new initiatives in 2024, focusing on mental health, feminism, and LBGTQ+ representation.
          </p>
        </div>

        <div className="flex h-screen flex-col gap-4 py-16">
          {
            projects.map((project, index) => <ProjectCard project={project} key={index} />)
          }
        </div>
      </section>


    </main>
  );
}
function Jumbotron({
  name
}: {
  name: string
}) {
  return (
    <section>

    </section>
  )
}
