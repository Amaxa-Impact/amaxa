"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { BlurImage } from "~/components/ui/apple-cards";
import { projects } from "./projects";
import { ApplyButton } from "~/components/apply";

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
          <div className="relative w-full max-h-[320px] md:max-h-[320px] sm:max-h-[240px] bg-white flex flex-col px-6 md:px-12 lg:px-20">
        {/* Background container - hidden but preserved for reference */}
        <div className="absolute inset-0 invisible">
          <div className="w-full h-full" style={{ background: "url(/Untitled design.png)" }} />
        </div>
        {/* Content container with flex layout */}
        <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-16 lg:px-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="max-w-full md:max-w-3xl lg:max-w-4xl mb-12 md:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-light leading-tight text-[#3B3B3B]">
               Explore{" "}
                <span className="font-normal text-[#3B3B3B]">
                  Our Projects 
                </span>
              </h1>

              {/* Green wavy line - SVG replacement for the image */}
              <div className="relative h-6 w-48 md:w-64 lg:w-200 ml-auto -mt-2 md:-mt-4">
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


     <section className="container mx-auto flex flex-col">
        <div className="text-[#3B3B3B] flex flex-col gap-10 py-10">
        <section className="w-full py-16 md:py-24 lg:py-32 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
      
       
          <div className="space-y-16 md:space-y-24">
         
              <div>
                <h3 className="text-2xl md:text-3xl font-normal text-[#3B3B3B] mb-4">
                Our projects are high-impact, innovative, and
                community-driven.
                 </h3>
                <p className="text-lg mb-6 max-w-3xl">
                  We have partnered with nonprofits in
                  Palestine, Liberia, and Uganda whose <strong>community-founded
                  solutions are innovative in their fields</strong>, such as ISNAD
                  Community Center's approach to community-based learning, the
                  first in its area, and the Nyaka School's holistic approach to
                  supporting AIDS-affected communities.
                </p>
                <p className="text-lg mb-6 max-w-3xl">
                 <strong> Where we spotted gaps in high-impact projects that our members
                  wanted to work on, we created our own. </strong> Led by COO
                  Alexi Jones, we have launched three new initiatives in 2024,
                  focusing on <strong>mental health, feminism, and LBGTQ+
                  representation.</strong>
                </p>
                {/* <a
                  href="/projects"
                  className="inline-flex items-center justify-center px-6 py-2 bg-[#BCD96C] rounded-full text-[#3B3B3B] hover:bg-[#a9c55a] transition-colors"
                >
                  Explore All Projects →
                </a> */}
              </div>
            </div>
          </div>
     
      </section>

        </div>

        <div className="flex h-screen flex-col gap-4 py-16">
          {
            projects.map((project, index) => <ProjectCard project={project} key={index} />)
          }
        </div>
      </section> 

{/* <section className="w-full py-16 md:py-24 lg:py-32 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
      
       
          <div className="space-y-16 md:space-y-24">
         
              <div>
                <h3 className="text-2xl md:text-3xl font-normal text-[#3B3B3B] mb-4">
                  Our projects and initiatives are high-impact.
                </h3>
                <p className="text-lg mb-6 max-w-3xl">
                  Our projects are high-impact, innovative, and
                  community-driven. We have partnered with nonprofits in
                  Palestine, Liberia, and Uganda whose community-founded
                  solutions are innovative in their fields, such as ISNAD
                  Community Center's approach to community-based learning, the
                  first in its area, and the Nyaka School's holistic approach to
                  supporting AIDS-affected communities.
                </p>
                <p className="text-lg mb-6 max-w-3xl">
                  Where we spotted gaps in high-impact projects that our members
                  wanted to work on, we created our own. Led by Head of Programs
                  Alexi Jones, we have launched three new initiatives in 2024,
                  focusing on mental health, feminism, and LBGTQ+
                  representation.
                </p>
                <a
                  href="/projects"
                  className="inline-flex items-center justify-center px-6 py-2 bg-[#BCD96C] rounded-full text-[#3B3B3B] hover:bg-[#a9c55a] transition-colors"
                >
                  Explore All Projects →
                </a>
              </div>
            </div>
          </div>
     
      </section> */}

      


    </main>
  );
}
