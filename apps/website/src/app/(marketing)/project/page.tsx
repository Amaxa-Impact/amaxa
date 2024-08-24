"use client";

import React from "react";
import { motion } from "framer-motion";

import { BlurImage } from "~/components/ui/apple-cards";

const projects = [
  {
    title: "Feeding Gaza: support for families in crisis",
    image: "/gazachamps.png",
  },
  {
    title: "Nyaka Global, Giving light: solar solutions for Ugandan grandmas",
    image: "/nyaka.jpg",
  },
  {
    title: `Ukraine : “Frontline support: providing urgent medical aid to Ukrainians caught in the crossfire.”`,
    image: "/ukraine.png",
  },
  {
    title: "Karina’s Library",
    image: "/libr.png",
  },
  {
    title:
      "Global Forest: Going green: planting trees and tracking carbon sequestration",
    image: "/forest.png",
  },
  {
    title:
      "ISNAD: Expanding learning and community: comprehensive support for Palestinian students",
    image: "/insad.png",
  },
  {
    title: "LGBTQ+ Artists",
    image: "/lgbtq.png",
  },
  {
    title: `Mental Health First Aid: Mind matters, research, expert opinions, and peer to peer education`,
    image: "/mhfa.png",
  },
  {
    title: "Educhildren",
    image: "/educhildren.webp",
  },
];

const ProjectCard = ({
  project,
}: {
  project: {
    title: string;
    image: string;
  };
}) => {
  return (
    <div className="flex h-screen w-full flex-col items-start p-8">
      <h1 className="mb-8 text-5xl font-bold">Project</h1>
      <motion.div className="relative z-10 flex h-56 w-full flex-row items-start justify-start overflow-hidden rounded-3xl bg-gray-100 dark:bg-neutral-900 md:h-80">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-30 w-1/4 bg-black" />
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
    </div>
  );
};

export default function Page() {
  return (
    <div>
      {projects.map((project, index) => (
        <ProjectCard project={project} key={index} />
      ))}
    </div>
  );
}
