"use client";

import React from "react";
import CardContainer from "@/components/ui/span-cards";
import { motion } from "framer-motion";

const cardContents = [
  {
    title: "Apply",
    description:
      "We personally match you to one of our 10 high-impact projects with global nonprofits.",
  },
  {
    title: "Match",
    description:
      "We match you to a remote team of other ámaxa members and an expert coach.",
  },
  {
    title: "Effect Change.",
    description:
      "Together, you spend 3 months meeting remotely, planning a unique event, campaign, or other project.",
  },
];
export default function HowItWorks() {
  return (
    <motion.section className="relative pb-8">
      <h3 className="mt-20 text-[30px] font-bold md:text-[50px] ">
        How It Works
      </h3>
      <CardContainer cards={cardContents} />
    </motion.section>
  );
}
