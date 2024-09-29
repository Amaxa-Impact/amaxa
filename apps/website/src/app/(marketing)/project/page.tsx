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
    </Link>
  );
};

export default function Page() {
  return (
    <div className="flex h-screen flex-col gap-4 overflow-y-scroll py-16">
      {projects.map((project, index) => (
        <ProjectCard project={project} key={index} />
      ))}
    </div>
  );
}
