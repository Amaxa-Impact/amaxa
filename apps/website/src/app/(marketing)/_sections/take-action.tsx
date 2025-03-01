"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function TakeActionSection() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <section className="flex flex-col mx-auto container ">
      <div className="w-full px-4">
        <motion.h2
          className="text-md font-mono "
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          TAKE ACTION
        </motion.h2>
        <motion.p
          className="text-4xl pt-10 pb-8 "
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Join our next cohort to be a part of the fight.
        </motion.p>
        <div className="space-y-4">
          {[
            {
              text: "I'm a high school student",
              action: "Apply to Ámaxa for High School",
            },
            {
              text: "I'm a college student or professional",
              action: "Apply to Ámaxa for Professionals",
            },
          ].map((button, index) => (
            <motion.button
              key={index}
              className="w-full border bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-6 rounded-[24px] transition-colors duration-200 flex justify-between items-center"
              onMouseEnter={() => setHoveredButton(button.text)}
              onMouseLeave={() => setHoveredButton(null)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <span>{button.text}</span>
              <motion.div
                animate={{ x: hoveredButton === button.text ? 5 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
          ))}
        </div>
        <motion.div
          className="mt-8 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a href="#" className="transition-colors duration-200 text-gray-600">
            Not ready to apply yet?{" "}
            <strong className="font-semibold">
              {" "}
              Learn more about how our program works{" "}
            </strong>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
