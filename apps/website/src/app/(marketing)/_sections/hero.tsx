"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ApplyButton } from "~/components/apply";

interface ContentItem {
  image: string;
  statement: string;
}

// Enhanced typewriter hook that supports manual navigation
const useTypewriter = (
  texts: string[],
  typingSpeed: number = 50,
  deletingSpeed: number = 30,
  delayAfterTyping: number = 1500
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
            currentText?.substring(0, displayedText.length + 1) as string
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
          setDisplayedText(displayedText.substring(0, displayedText.length - 1));
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
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOMuUN3gYQ8a9AhxfoFrcKlOZUmsICGX3Sqk0V",
    statement: "I provided light for grandmothers in Uganda.",
  },
  {
    image:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOa56HTxIBDGmcbISEzQYZx81iL0rWJ43h2T9d",
    statement: "I provided a Gazan family the funds to survive.",
  },
  {
    image:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOMQ3852YQ8a9AhxfoFrcKlOZUmsICGX3Sqk0V",
    statement:
      "I provided medical supplies to Ukrainians.",
  },
  {
    image:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOEftqdP9NYGn17FfRk38wqIh5UP6LM9TadAmy",
    statement: "I helped build effective mental health resources.",
  },
  {
    image:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOSbTnpOwdQt18rFgVynhG5ljvz0eRmMCYuOWw",
    statement: "I fought back against book bans and censorship.",
  },
  {
    image:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOTGJVNwrPvV4ygRa57DXtJwU9SfhC1qxONmlA",
    statement: "I sponsored a Liberian student's full year tuition.",
  },
  {
    image:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOBGXc3oMfgbteu1vLlWOMACT9miBqyShdJ8jc",
    statement:
      "I helped students in the West Bank build community.",
  },
  {
    image:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOmSb46sGZ8BkVU4SJgWfYiHpwKRujOh50EtyM",
    statement:
      "I planted a tree in my community to sequester CO2.",
  },
  {
    image:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOmSb46sGZ8BkVU4SJgWfYiHpwKRujOh50EtyM",
    statement:
      "I helped promote diverse storytelling &  LGBTQ+ creatives.",
  },
];

const ImpactSection: React.FC = () => {
  // Extract just the statements for the typewriter
  const statements: string[] = content.map((item) => item.statement);
  const [direction, setDirection] = useState<number>(1);

  // Use the enhanced typewriter hook
  const { text: typedText, currentIndex: activeIndex, jumpToIndex } =
    useTypewriter(statements, 40, 20, 2000);

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
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-24 flex flex-col lg:flex-row items-center justify-between">
      <div className="w-full lg:w-1/2 mb-10 lg:mb-0 lg:pr-8">
        <div className="max-w-xl mx-auto lg:mx-0">
          <p className="text-gray-700 text-lg md:text-xl pb-4 md:pb-8">
            Change{" "}
            <span className="font-thin">"I wish I could help"</span> to
          </p>

          {/* Rotating impact statement with typewriter effect */}
          <div className="h-[120px] sm:h-[150px] md:h-[180px] flex items-center py-4 md:py-8">
            <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 leading-tight">
              {typedText}
              <span className="animate-blink">|</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-3 md:gap-4 pt-4 md:pt-8">
            <React.Suspense fallback={<div>Loading...</div>}>

              <ApplyButton
                variant="color"
              >
                Join Us <span className="ml-2">→</span>
              </ApplyButton>
            </React.Suspense>

            <Link
              href="/project"
              className="inline-flex items-center px-5 sm:px-6 md:px-8 py-2 md:py-3 rounded-full border-[1px] border-[#3B3B3B] text-[#] font-light hover:bg-gray-100 transition-colors text-sm md:text-base"
            >
              Explore All Projects <span className="ml-2">→</span>
            </Link>
          </div>

          {/* Carousel indicators */}
          <div className="flex gap-2 mt-6 md:mt-8 justify-center lg:justify-start">
            {content.map((_, index) => (
              <button
                key={index}
                onClick={() => navigateTo(index)}
                className={`w-2 md:w-2.5 h-2 md:h-2.5 rounded-full transition-colors duration-300
                          ${index === activeIndex
                    ? "bg-gray-800"
                    : "bg-gray-300"
                  }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 relative">
        <div className="relative mx-auto flex items-center justify-center">
          {/* Responsive image carousel */}
          <div className="flex items-center justify-center">
            {/* Left small image - hidden on smallest screens */}
            <motion.div
              variants={sideImageVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              className="hidden sm:block rounded-[16px] overflow-hidden cursor-pointer z-10 border-2 border-white shadow-md"
              style={{
                width: "min(120px, 20vw)",
                height: "min(160px, 26vw)",
                position: "relative",
                margin: "0 5px",
              }}
              onClick={() => navigateTo(prevIndex)}
            >
              <Image
                src={content[prevIndex]?.image as string}
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
                className="rounded-[20px] overflow-hidden z-20 border-2 border-white shadow-lg"
                style={{
                  width: "min(280px, 70vw)",
                  height: "min(350px, 90vw)",
                  position: "relative",
                  margin: "0 5px",
                }}
              >
                <Image
                  src={content[activeIndex]?.image as string}
                  alt={content[activeIndex]?.statement as string}
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
              className="hidden sm:block rounded-[16px] overflow-hidden cursor-pointer z-10 border-2 border-white shadow-md"
              style={{
                width: "min(120px, 20vw)",
                height: "min(160px, 26vw)",
                position: "relative",
                margin: "0 5px",
              }}
              onClick={() => navigateTo(nextIndex)}
            >
              <Image
                src={content[nextIndex]?.image as string}
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
          <div className="sm:hidden flex justify-between w-full absolute top-1/2 transform -translate-y-1/2 px-2">
            <button
              onClick={() => navigateTo(prevIndex)}
              className="bg-white/80 rounded-full p-2 shadow-md"
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
              className="bg-white/80 rounded-full p-2 shadow-md"
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
    </div >
  );
};

export default ImpactSection;
