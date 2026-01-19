/**
 * AnimatedTestimonials - Carousel of testimonials with image stack animation
 *
 * Shows testimonials one at a time with:
 * - Stacked images that animate when switching
 * - Word-by-word text reveal animation
 * - Optional autoplay
 *
 * Usage:
 * <AnimatedTestimonials
 *   testimonials={[{ quote, name, designation, src }, ...]}
 *   autoplay={true}
 * />
 */

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}

interface AnimatedTestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
}

export function AnimatedTestimonials({
  testimonials,
  autoplay = false,
}: AnimatedTestimonialsProps) {
  const [active, setActive] = useState(0);

  // Navigation handlers
  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => index === active;

  // Autoplay interval
  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, handleNext]);

  // Pre-generate random rotations for the stacked image effect
  // This prevents hydration mismatches from Math.random during render
  const [rotations] = useState(() =>
    Array.from(
      { length: testimonials.length },
      () => Math.floor(Math.random() * 21) - 10,
    ),
  );

  const getRotation = (index: number) => rotations[index] ?? 0;

  return (
    <div className="mx-auto max-w-sm px-4 py-20 font-bold md:max-w-4xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-20 md:grid-cols-2">
        {/* Image stack */}
        <div>
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: getRotation(index),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : getRotation(index),
                    zIndex: isActive(index)
                      ? 40
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: getRotation(index),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Text content */}
        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {/* Name and designation */}
            <h3 className="text-2xl font-bold text-black dark:text-white">
              {testimonials[active]?.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-neutral-500">
              {testimonials[active]?.designation}
            </p>

            {/* Quote with word-by-word animation */}
            <motion.p className="mt-8 text-lg text-gray-500 dark:text-neutral-300">
              {testimonials[active]?.quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>

          {/* Navigation buttons */}
          <div className="flex gap-4 pt-12 md:pt-0">
            <button
              onClick={handlePrev}
              className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:rotate-12 dark:text-neutral-400" />
            </button>
            <button
              onClick={handleNext}
              className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
              aria-label="Next testimonial"
            >
              <ArrowRight className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:-rotate-12 dark:text-neutral-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
