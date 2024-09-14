//@ts-nocheck
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Card, CardContent } from "@amaxa/ui/card";

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
];

export default function StudentStories() {
  const [activeStory, setActiveStory] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    const startIntervals = () => {
      clearInterval(intervalRef?.current!);
      clearInterval(progressIntervalRef?.current!);

      intervalRef.current = setInterval(() => {
        setActiveStory((prev) => (prev + 1) % stories.length);
        setProgress(0);
      }, 10000);

      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => Math.min(prev + 1, 100));
      }, 100);
    };

    startIntervals();

    return () => {
      clearInterval(intervalRef?.current!);
      clearInterval(progressIntervalRef.current!);
    };
  }, [activeStory]);

  const handleStoryClick = (index: any) => {
    setActiveStory(index);
    setProgress(0);
    clearInterval(intervalRef.current!);
    clearInterval(progressIntervalRef.current!);
  };

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
          Student Stories
        </h2>
        <div className="flex flex-col items-center justify-center space-y-8 md:flex-row md:items-start md:space-x-8 md:space-y-0">
          <div className="w-full max-w-2xl md:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-2 text-2xl font-semibold">
                      {stories[activeStory]?.name}
                    </h3>
                    <p className="mb-4 text-muted-foreground">
                      Age: {stories[activeStory]?.age} | Country:{" "}
                      {stories[activeStory]?.country}
                    </p>
                    <p className="mb-4">{stories[activeStory]?.story}</p>
                    <blockquote className="border-l-4 border-primary pl-4 italic">
                      "{stories[activeStory]?.quote}"
                    </blockquote>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="w-full max-w-md md:w-1/3">
            <div className="flex flex-col space-y-4">
              {stories.map((story, index) => (
                <div
                  key={index}
                  className="relative cursor-pointer"
                  onClick={() => handleStoryClick(index)}
                >
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden rounded-lg bg-neutral-300/50 dark:bg-neutral-300/30">
                    <motion.div
                      className="h-full origin-left bg-neutral-500 dark:bg-white"
                      initial={{ scaleX: 0 }}
                      animate={{
                        scaleX: activeStory === index ? progress / 100 : 0,
                      }}
                      transition={{ duration: 0.1, ease: "linear" }}
                    />
                  </div>
                  <h2 className="mb-2 text-xl font-bold">
                    {story.name.split(",")[0]}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {story.country}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
