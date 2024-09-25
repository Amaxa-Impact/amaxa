"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, Quote, User, Users } from "lucide-react";

const stories = [
  {
    name: "Maitha",
    age: 17,
    country: "UAE",
    story:
      "Created an Instagram account for the ISNAD Community Center in the West Bank, Palestine. Taught them to use Canva for posts and stories, ensuring they could maintain their social presence for the foreseeable future.",
    quote:
      "It's not every day I come across a program that treats students like global leaders.",
  },
  {
    name: "Zhao, Jad, Noor, and Panshul",
    age: "14-16",
    country: "China, Lebanon, Qatar, UAE",
    story:
      "Created Accessifyed, which now offers 16 math lessons and 10 English lessons with tutoring contact info for each lesson. They are now Ámaxa Student Ambassadors, working to expand Accessifyed from an MVP to a scaled solution for all of ISNAD's students.",
    quote:
      "Since almost all students in Palestine have access to the Web, we aim to create an interactive, educational website where students can find pre-recorded lessons by tutors who will be recruited by our team.",
  },
  {
    name: "Otilia, Aria, and Katelyn",
    age: 16,
    country: "Romania, US",
    story:
      "Through a bake sale and a martial arts tournament, they raised hundreds of dollars that Sekou, the head of Educhildren, delivered directly to 7 students in Liberia, covering the cost of their year's tuition.",
    quote:
      "In the beginning of this project, I thought it was impossible. As time progressed, I realized that we could definitely create this change and, no matter how big anything may seem, with the right people and the right support, we can.",
  },
  {
    name: "Isabella and Zobia",
    age: "16-17",
    country: "US",
    story:
      "Planning student benefit concert to raise funds for Gazan students - ONGOING",
    quote: "This is an ongoing project- updates to come!",
  },
  {
    name: "An Nhi, Mohammed, and Lauryn",
    age: "16-17",
    country: "US, Turkey, and Vietnam",
    story:
      "Planted trees across 3 countries as part of the Amaxa Global Forest Initiative. Each team member identified an appropriate place to plant a native tree in their community, procured a native tree, and planted it. They did measurements on the tree and started the process of calculating the CO2 sequestration.",
    quote:
      "Amaxa taught me that if I have an idea that helps other people, I can develop it.",
  },
];

export const StoriesCarousel = memo(() => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextStory = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % stories.length);
    progressRef.current = 0;
    setProgress(0);
  }, []);

  const updateProgress = useCallback(() => {
    progressRef.current += 0.5;
    if (progressRef.current >= 100) {
      nextStory();
    } else {
      setProgress(progressRef.current);
    }
  }, [nextStory]);

  useEffect(() => {
    intervalRef.current = setInterval(updateProgress, 50);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateProgress]);

  const handleStoryClick = (index: number) => {
    setActiveIndex(index);
    progressRef.current = 0;
    setProgress(0);
  };

  return (
    <section className="py-16 text-gray-800">
      <div className="container mx-auto px-4">
        <h3 className="mb-12 bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-center text-4xl font-extrabold text-transparent">
          Inspiring Stories of Young Changemakers
        </h3>
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[300px_1fr]">
          <div className="space-y-4">
            {stories.map((story, index) => (
              <motion.div
                key={index}
                className={`relative cursor-pointer rounded-md p-4 transition-all duration-300 ease-in-out ${
                  index === activeIndex ? "rounded-lg bg-white shadow-md" : ""
                }`}
                onClick={() => handleStoryClick(index)}
                layout
              >
                <motion.div
                  className="absolute bottom-0 left-0 top-0 w-1 origin-top rounded-3xl bg-purple-500"
                  initial={{ scaleY: 0 }}
                  animate={{
                    scaleY: index === activeIndex ? progress / 100 : 0,
                  }}
                  transition={{ duration: 0.1 }}
                />
                <div className="ml-2 flex items-center space-x-4">
                  {story.name.includes(",") ? (
                    <Users className="h-6 w-6 text-purple-600" />
                  ) : (
                    <User className="h-6 w-6 text-purple-600" />
                  )}
                  <h4 className="text-xl font-semibold text-gray-800">
                    {story.name}
                  </h4>
                </div>
                <AnimatePresence mode="wait">
                  {index === activeIndex && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="ml-2 mt-2 overflow-hidden text-gray-600"
                    >
                      {story.age} years old, {story.country}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex min-h-[300px] flex-col items-start justify-center rounded-lg bg-white p-6 shadow-lg "
            >
              <div className="mb-4 flex items-center space-x-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <h3 className="text-2xl font-semibold text-gray-800">
                  Their Story
                </h3>
              </div>
              <p className="mb-6 text-gray-600">
                {stories?.[activeIndex]?.story}
              </p>
              <div className="flex items-start space-x-2">
                <Quote className="h-6 w-6 flex-shrink-0 text-primary" />
                <p className="italic text-gray-700">
                  {stories[activeIndex]?.quote}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
});

StoriesCarousel.displayName = "StoriesCarousel";
