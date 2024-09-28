import React from "react";
import { motion } from "framer-motion";

import { WordRotate } from "~/components/word-rotate";

export const AmaxaDoes = () => {
  const rotatingWords = [
    "nonprofits",
    "communities",
    "the world",
    "your passion",
    "social impact",
  ];

  return (
    <div className="py-32 text-black sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Effect change for{" "}
            <WordRotate
              words={rotatingWords}
              className="text-yellow-300"
              duration={3000}
              framerProps={{
                initial: { opacity: 0, y: -20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 20 },
                transition: { duration: 0.5, ease: "easeOut" },
              }}
            />
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl">
            Ámaxa matches you with a remote team, trained coach, evidence-based
            program, and integrated platform to complete high-impact projects
            for our partner nonprofits and initiatives.
          </p>
          <div className="mt-10">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/apply"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-50"
            >
              Get Started
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
