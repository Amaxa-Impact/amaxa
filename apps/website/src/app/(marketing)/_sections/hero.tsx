"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import { ApplyButton } from "~/components/apply";

interface ContentItem {
  image: string;
  statement: string;
}

// Enhanced typewriter hook that supports manual navigation
const useTypewriter = (
  texts: string[],
  typingSpeed = 50,
  deletingSpeed = 30,
  delayAfterTyping = 1500,
) => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);

  // Function to manually navigate to specific index
  const jumpToIndex = (index: number): void => {
    if (index === currentIndex) return;
    setIsTyping(false);
    setTargetIndex(index);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentText = texts[currentIndex];

    if (isTyping) {
      // Typing phase
      if (displayedText === currentText) {
        // Finished typing, wait before deleting
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, delayAfterTyping);
      } else {
        // Continue typing
        timeout = setTimeout(() => {
          setDisplayedText(
            currentText?.substring(0, displayedText.length + 1)!,
          );
        }, typingSpeed);
      }
    } else {
      // Deleting phase
      if (displayedText === "") {
        // Finished deleting, decide where to go next
        if (targetIndex !== null) {
          setCurrentIndex(targetIndex);
          setTargetIndex(null);
        } else {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }
        setIsTyping(true);
      } else {
        // Continue deleting
        timeout = setTimeout(() => {
          setDisplayedText(
            displayedText.substring(0, displayedText.length - 1),
          );
        }, deletingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [
    displayedText,
    isTyping,
    currentIndex,
    texts,
    typingSpeed,
    deletingSpeed,
    delayAfterTyping,
    targetIndex,
  ]);

  return { text: displayedText, currentIndex, jumpToIndex };
};

// Content pairs (image and impact statement)
const content: ContentItem[] = [
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

const ImpactSection: React.FC = () => {
  // Extract just the statements for the typewriter
  const statements: string[] = content.map((item) => item.statement);
  const [direction, setDirection] = useState<number>(1);

  // Use the enhanced typewriter hook
  const {
    text: typedText,
    currentIndex: activeIndex,
    jumpToIndex,
  } = useTypewriter(statements, 40, 20, 2000);

  // Calculate previous and next indices
  const prevIndex: number = (activeIndex - 1 + content.length) % content.length;
  const nextIndex: number = (activeIndex + 1) % content.length;

  // Manual navigation function
  const navigateTo = (index: number): void => {
    setDirection(index > activeIndex ? 1 : -1);
    jumpToIndex(index);
  };

  // Animation variants
  const mainImageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
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
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.5,
      },
    }),
  };

  const sideImageVariants = {
    initial: { opacity: 0.7, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-between px-16 py-12 shadow-sm md:py-16 lg:flex-row lg:py-24">
      <div className="mb-10 w-full lg:mb-0 lg:w-1/2 lg:pr-8">
        <div className="mx-auto max-w-xl lg:mx-0">
          <p className="pb-8 text-lg text-gray-700 md:pb-8 md:text-xl">
            Change <span className="font-thin">"I wish I could help"</span> to
          </p>

          {/* Rotating impact statement with typewriter effect */}
          <div className="flex h-[120px] items-center py-4 sm:h-[150px] md:h-[180px] md:py-8">
            <h2 className="pb-8 text-xl font-bold leading-tight text-gray-800 sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl">
              {typedText}
              <span className="animate-blink">|</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-3 pb-4 pt-4 md:gap-4 md:pt-8">
            <React.Suspense fallback={<div>Loading...</div>}>
              <ApplyButton variant="color">
                Join Us <span className="ml-2">→</span>
              </ApplyButton>
            </React.Suspense>

            <Link
              href="/project"
              className="inline-flex items-center rounded-full border-[1px] border-[#3B3B3B] px-5 py-2 text-sm font-light text-[#] transition-colors hover:bg-gray-100 sm:px-6 md:px-8 md:py-3 md:text-base"
            >
              Explore All Projects <span className="ml-2">→</span>
            </Link>
          </div>

          {/* Carousel indicators */}
          {/* <div className="mt-6 flex justify-center gap-2 md:mt-8 lg:justify-start pb-4">
            {content.map((_, index) => (
              <button
                key={index}
                onClick={() => navigateTo(index)}
                className={`h-2 w-2 rounded-full transition-colors duration-300 md:h-2.5 md:w-2.5 ${
                  index === activeIndex ? "bg-gray-800" : "bg-gray-300"
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div> */}
        </div>
      </div>

      <div className="relative w-full lg:w-1/2">
        <div className="relative mx-auto flex items-center justify-center">
          {/* Responsive image carousel */}
          <div className="flex items-center justify-center">
            {/* Left small image - hidden on smallest screens */}
            <motion.div
              variants={sideImageVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              className="z-10 hidden cursor-pointer overflow-hidden rounded-[24px] shadow-lg sm:block"
              style={{
                width: "min(160px, 70vw)",
                height: "min(200px, 90vw)",
                position: "relative",
                margin: "0 4px",
              }}
              onClick={() => navigateTo(prevIndex)}
            >
              <Image
                src={content[prevIndex]?.image!}
                alt="Previous"
                fill
                priority
                sizes="(max-width: 640px) 0px, (max-width: 1024px) 20vw, 120px"
                quality={70}
                style={{ objectFit: "cover" }}
              />
            </motion.div>

            {/* Main image with Framer Motion animations */}
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={`main-${activeIndex}`}
                custom={direction}
                variants={mainImageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="z-20 cursor-pointer overflow-hidden rounded-[24px] border-2 border-white shadow-lg"
                style={{
                  width: "min(320px, 70vw)",
                  height: "min(400px, 90vw)",
                  position: "relative",
                  margin: "0 8px",
                }}
              >
                <Image
                  src={content[activeIndex]?.image!}
                  alt={content[activeIndex]?.statement!}
                  fill
                  priority
                  sizes="(max-width: 640px) 70vw, (max-width: 1024px) 50vw, 280px"
                  quality={90}
                  style={{ objectFit: "cover" }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Right small image - hidden on smallest screens */}
            <motion.div
              variants={sideImageVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              className="z-10 hidden cursor-pointer overflow-hidden rounded-[24px] shadow-md sm:block"
              style={{
                width: "min(160px, 70vw)",
                height: "min(200px, 90vw)",
                position: "relative",
                margin: "0 4px",
              }}
              onClick={() => navigateTo(nextIndex)}
            >
              <Image
                src={content[nextIndex]?.image!}
                alt="Next"
                priority
                fill
                sizes="(max-width: 640px) 0px, (max-width: 1024px) 20vw, 120px"
                quality={70}
                style={{ objectFit: "cover" }}
              />
            </motion.div>
          </div>

          {/* Mobile navigation buttons - visible only on smallest screens */}
          <div className="absolute top-1/2 flex w-full -translate-y-1/2 transform justify-between px-2 sm:hidden">
            <button
              onClick={() => navigateTo(prevIndex)}
              className="rounded-full bg-white/80 p-2 shadow-md"
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => navigateTo(nextIndex)}
              className="rounded-full bg-white/80 p-2 shadow-md"
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactSection;
