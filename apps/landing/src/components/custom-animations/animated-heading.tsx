"use client";

import { motion } from "framer-motion";

interface AnimatedHeadingProps {
  text: string;
  className?: string;
}

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.02, // very fast
      delayChildren: 0, // no wait
    },
  },
};

const letter = {
  hidden: { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.12,
      ease: "easeOut",
    },
  },
};

export function AnimatedHeading({
  text,
  className = "",
}: AnimatedHeadingProps) {
  return (
    <motion.h1
      className={className}
      variants={container}
      initial="hidden"
      animate="visible" // fires immediately
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={letter}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
  );
}
