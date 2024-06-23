"use client";

import type { Project } from "@/lib/constants/projects";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/constants/projects";
import { motion, useInView } from "framer-motion";

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [lastSelected, setLastSelected] = useState<Project | null>(null);

  const handleClick = (project: Project) => {
    setLastSelected(selected);
    setSelected(project);
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div className="relative py-10">
      <h1 className="mb-10 text-start text-5xl font-bold">Our Projects</h1>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {projects.map((project, index) => (
          <InViewComponent key={index} variants={itemVariants}>
            <ProjectCard project={project} handleClick={handleClick} />
          </InViewComponent>
        ))}
      </motion.div>
    </motion.div>
  );
}

const InViewComponent = ({
  children,
  variants,
}: {
  children: React.ReactNode;
  variants: any;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ scale: 1.05 }}
    >
      {children}
    </motion.div>
  );
};

const ProjectCard = ({
  project,
  handleClick,
}: {
  project: Project;
  handleClick: (project: Project) => void;
}) => {
  return (
    <Link href={"/project-landing/1/"}>
      <div
        className="group relative flex min-h-[200px] cursor-pointer flex-col justify-between py-10 dark:border-neutral-800 lg:border-b lg:border-l lg:border-r"
        onClick={() => handleClick(project)}
      >
        <div className="group pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover:opacity-100 dark:from-neutral-800"></div>
        <div className="w-full">
          <Image
            src={project.image}
            layout="fill"
            className="w-full"
            alt={project.name}
          />
        </div>
        <span
          className="absolute bottom-0 left-0 p-4 font-bold text-white"
          style={{ textShadow: "0 4px 8px rgba(0, 0, 0, 0.7)" }}
        >
          {project.name}
        </span>
      </div>
    </Link>
  );
};
