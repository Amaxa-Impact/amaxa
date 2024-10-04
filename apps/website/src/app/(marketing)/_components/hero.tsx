"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@amaxa/ui/button";

export default function Hero() {
  return (
    <motion.section className="relative flex flex-row  items-center gap-20 md:min-h-[375px]">
      <div className="hero-slide-up flex flex-col">
        {" "}
        <h1 className="animate-fade-in mt-6 translate-y-[-1rem] text-[30px] font-bold leading-none md:text-[80px] md:font-semibold">
          {" "}
          We help you effect
          <br /> change in the world.
        </h1>
        <p className="animate-fade-in mt-4 max-w-[600px] text-[#878787] md:mt-6">
          We connect high school students, college students, professionals, &
          retirees to high-impact projects with our 9 global partner nonprofits.
        </p>
        <div className="animate-fade-in mt-8">
          <div className="flex items-center space-x-4">
            <Link href="">
              <Button
                variant="outline"
                className="h-12 border border-primary px-6"
              >
                Learn How
              </Button>
            </Link>

            <a href="/apply">
              <Button className="h-12 px-5">Apply Now</Button>
            </a>
          </div>
        </div>
        <p className="mt-8 font-mono text-xs text-[#707070]">
          Trusted by over{" "}
          <Link href="/open-startup" prefetch>
            <span className="underline">150</span>
          </Link>{" "}
          students from over <span className="underline">45</span> countries.
        </p>
      </div>
      <Component />
    </motion.section>
  );
}
export function Component() {
  const imageVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (custom: { delay: number }) => ({
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 80,
        delay: custom.delay,
      },
    }),
  };

  const images = [
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-6Um1tKFLGDatGjZ10ztaBkQfzqFrGq.jpeg",
      alt: "Collage of global impact projects",
      top: "15%",
      left: "20%",
      width: 120,
      height: 120,
      delay: 0.2,
      borderRadius: "lg",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9cfb27c8dc95974580ee7a7c4d010138-LZ24I3ZBDZFuEAlaJn21ihbqUPxC90.png",
      alt: "Global volunteers in a video call",
      top: "15%",
      left: "80%",
      width: 120,
      height: 120,
      delay: 0.3,
      borderRadius: "lg",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/222c6202e7b91e8edfdc005f57e1618d-NqtJwiA63aMlaTEzaVj17boRIaM9wj.png",
      alt: "Diverse hands coming together",
      top: "80%",
      left: "50%",
      width: 120,
      height: 120,
      delay: 0.4,
      borderRadius: "full",
    },
    // Optional: Add more images for better distribution
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/example-image-4.png",
      alt: "Example Image 4",
      top: "50%",
      left: "20%",
      width: 120,
      height: 120,
      delay: 0.5,
      borderRadius: "lg",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/example-image-5.png",
      alt: "Example Image 5",
      top: "50%",
      left: "80%",
      width: 120,
      height: 120,
      delay: 0.6,
      borderRadius: "lg",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative lg:w-1/2"
    >
      <div className="relative h-[500px] w-full overflow-hidden rounded-lg bg-gray-200">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/20 to-transparent" />

        {images.map((image, index) => (
          <motion.div
            key={index}
            className="absolute"
            variants={imageVariants}
            custom={{ delay: image.delay }}
            initial="hidden"
            animate="visible"
            style={{
              top: image.top,
              left: image.left,
              width: image.width,
              height: image.height,
              transform: `translate(-50%, -50%)`,
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              layout="fill"
              objectFit="cover"
              className={`rounded-${image.borderRadius} shadow-lg`}
            />
          </motion.div>
        ))}

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-background/80 p-4 shadow-lg">
          <span className="text-4xl font-bold">9</span>
          <span className="ml-2 text-sm">Global Partners</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="absolute -bottom-4 -left-4 rounded-lg bg-background p-4 shadow-lg"
      >
        <h3 className="mb-2 font-semibold">Healthcare</h3>
        <p className="text-sm text-muted-foreground">350+ projects</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="absolute -right-4 -top-4 rounded-lg bg-background p-4 shadow-lg"
      >
        <h3 className="mb-2 font-semibold">Education</h3>
        <p className="text-sm text-muted-foreground">500+ projects</p>
      </motion.div>
    </motion.div>
  );
}
