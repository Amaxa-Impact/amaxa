/**
 * HeroCarousel - Animated hero section with rotating impact statements
 *
 * Shows:
 * - A typewriter effect cycling through impact statements
 * - A carousel of images that sync with the statements
 * - CTA buttons for joining and exploring projects
 *
 * The images animate when switching between statements.
 */

import { useState } from "react";
import { ApplyButton, LinkButton } from "@/components/shared/apply-button";
import { useTypewriter } from "@/hooks/use-typewriter";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Content pairs: each image has a matching impact statement
const content = [
  {
    image:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOXM5a2R0BrawSs24LUuYDb5IoTiA7Feh0fPKW",
    statement: "I provided light for grandmothers in Uganda.",
  },
  {
    image:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOVSuAZzWL0MYRHUetxwcyzJn3h7alsSdIDAKf",
    statement: "I provided a Gazan family the funds to survive.",
  },
  {
    image:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOFSqz9DhMgGqJpRmLFNh4KsQWVrkiIwAYnPaz",
    statement: "I provided medical supplies to Ukrainians.",
  },
  {
    image:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOkX5KHvRePnYWC5xuvVyLTmQRSKBf6hsFkHJO",
    statement: "I helped build effective mental health resources.",
  },
  {
    image:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOkD4GobRePnYWC5xuvVyLTmQRSKBf6hsFkHJO",
    statement: "I fought back against book bans and censorship.",
  },
  {
    image:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOaifCsCIBDGmcbISEzQYZx81iL0rWJ43h2T9d",
    statement: "I sponsored a Liberian student's full year tuition.",
  },
  {
    image:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOFHSjHghMgGqJpRmLFNh4KsQWVrkiIwAYnPaz",
    statement: "I helped students in the West Bank build community.",
  },
  {
    image:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOYEdEXWwlUs9XMErKJv7Faw8TpfmyuG5lVHhq",
    statement: "I planted a tree in my community to sequester CO2.",
  },
  {
    image:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToO8el17ogjXRpn0dgo1l6KOV2DuqGLya94cMIf",
    statement: "I helped promote LGBTQ+ creatives.",
  },
];

export function HeroCarousel() {
  const statements = content.map((item) => item.statement);
  const [direction, setDirection] = useState(1);

  const typewriterResult = useTypewriter(statements, 40, 20, 2000, true);
  const { text, currentIndex, jumpToIndex } = typewriterResult as {
    text: string;
    currentIndex: number;
    jumpToIndex: (index: number) => void;
  };

  // Calculate adjacent indices for the carousel
  const prevIndex = (currentIndex - 1 + content.length) % content.length;
  const nextIndex = (currentIndex + 1) % content.length;

  // Navigate to a specific slide
  const navigateTo = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    jumpToIndex(index);
  };

  // Animation variants for the main image
  const mainImageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.5,
      },
    }),
  };

  // Animation for side images
  const sideImageVariants = {
    initial: { opacity: 0.7, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  return (
    <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between px-6 py-12 md:px-16 md:py-16 lg:flex-row lg:py-24">
      {/* Left side: Text content */}
      <div className="mb-10 w-full lg:mb-0 lg:w-1/2 lg:pr-8">
        <div className="mx-auto max-w-xl lg:mx-0">
          {/* Intro text */}
          <p className="pb-8 text-lg text-gray-700 md:text-xl">
            Change <span className="font-thin">"I wish I could help"</span> to
          </p>

          {/* Typewriter statement */}
          <div className="flex h-[120px] items-center py-4 sm:h-[150px] md:h-[180px] md:py-8">
            <h2 className="pb-8 text-xl leading-tight font-bold text-gray-800 sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl">
              {text}
              <span className="animate-pulse">|</span>
            </h2>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 pt-4 pb-4 md:gap-4 md:pt-8">
            <ApplyButton variant="color">
              Join Us <span className="ml-2">→</span>
            </ApplyButton>
            <LinkButton href="/projects" variant="outline">
              Explore All Projects <span className="ml-2">→</span>
            </LinkButton>
          </div>
        </div>
      </div>

      {/* Right side: Image carousel */}
      <div className="relative w-full lg:w-1/2">
        <div className="relative mx-auto flex items-center justify-center">
          <div className="flex items-center justify-center">
            {/* Left side image (hidden on mobile) */}
            <motion.div
              variants={sideImageVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              className="z-10 hidden cursor-pointer overflow-hidden rounded-3xl shadow-lg sm:block"
              style={{
                width: "min(160px, 70vw)",
                height: "min(200px, 90vw)",
                position: "relative",
                margin: "0 4px",
              }}
              onClick={() => navigateTo(prevIndex)}
            >
              <img
                src={content[prevIndex]?.image ?? ""}
                alt="Previous"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </motion.div>

            {/* Main image */}
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={`main-${currentIndex}`}
                custom={direction}
                variants={mainImageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="z-20 cursor-pointer overflow-hidden rounded-3xl border-2 border-white shadow-lg"
                style={{
                  width: "min(320px, 70vw)",
                  height: "min(400px, 90vw)",
                  position: "relative",
                  margin: "0 8px",
                }}
              >
                <img
                  src={content[currentIndex]?.image ?? ""}
                  alt={content[currentIndex]?.statement ?? ""}
                  loading="eager"
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Right side image (hidden on mobile) */}
            <motion.div
              variants={sideImageVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              className="z-10 hidden cursor-pointer overflow-hidden rounded-3xl shadow-md sm:block"
              style={{
                width: "min(160px, 70vw)",
                height: "min(200px, 90vw)",
                position: "relative",
                margin: "0 4px",
              }}
              onClick={() => navigateTo(nextIndex)}
            >
              <img
                src={content[nextIndex]?.image ?? ""}
                alt="Next"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>

          {/* Mobile navigation buttons */}
          <div className="absolute top-1/2 flex w-full -translate-y-1/2 justify-between px-2 sm:hidden">
            <button
              onClick={() => navigateTo(prevIndex)}
              className="rounded-full bg-white/80 p-2 shadow-md"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigateTo(nextIndex)}
              className="rounded-full bg-white/80 p-2 shadow-md"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
