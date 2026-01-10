"use client";

import { Suspense, useRef } from "react";
import Image from "next/image";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useInView } from "framer-motion";

import { ApplyButton } from "~/components/apply";
import { TextShimmer } from "../text-shimmer";

export default function PlatformHero() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section
      id="hero"
      className="relative mx-auto mt-32 max-w-[80rem] px-6 text-center md:px-8"
    >
      <div className="animate-fade-in group inline-flex h-7 translate-y-[-1rem] items-center justify-between gap-1 rounded-full border border-white/5 bg-white/10 px-3 text-xs text-white opacity-0 backdrop-filter-[12px] transition-all ease-in hover:cursor-pointer hover:bg-white/20 dark:text-black">
        <TextShimmer className="inline-flex items-center justify-center">
          <span>✨ Apply now for our beta!</span>{" "}
          <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </TextShimmer>
      </div>
      <h1 className="animate-fade-in translate-y-[-1rem] bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 text-5xl leading-none font-medium tracking-tighter text-balance text-transparent opacity-0 [--animation-delay:200ms] sm:text-6xl md:text-7xl lg:text-8xl dark:from-white dark:to-white/40">
        A Personalized Platform for
        <br className="hidden md:block" /> Making Impact
      </h1>
      <p className="animate-fade-in mb-12 translate-y-[-1rem] text-lg tracking-tight text-balance text-gray-400 opacity-0 [--animation-delay:400ms] md:text-xl">
        Explore our platform which we've spent hundreds of hours crafting to
        amplify
        <br className="hidden md:block" /> what you can achive.
      </p>
      <Suspense>
        <ApplyButton variant="color">Apply Now</ApplyButton>
      </Suspense>
      <div
        ref={ref}
        className="animate-fade-up relative mt-[8rem] opacity-0 [--animation-delay:400ms] [perspective:2000px] after:absolute after:inset-0 after:z-50 after:[background:linear-gradient(to_top,hsl(var(--background))_30%,transparent)]"
      >
        <div
          className={`bg-opacity-[0.01] rounded-xl border border-white/10 bg-white before:absolute before:top-0 before:bottom-1/2 before:left-0 before:h-full before:w-full before:[background-image:linear-gradient(to_bottom,var(--primary),var(--primary),transparent_40%)] before:opacity-0 before:[filter:blur(180px)] ${
            inView ? "before:animate-image-glow" : ""
          }`}
        >
          <Image
            src="/platform-dark.png"
            alt="Hero Image"
            width={1200}
            height={800}
            className="relative hidden h-full w-full rounded-[inherit] border object-contain dark:block"
          />
          <Image
            src="/platform-dark.png"
            alt="Hero Image"
            width={1200}
            height={800}
            className="relative block h-full w-full rounded-[inherit] border object-contain dark:hidden"
          />
        </div>
      </div>
    </section>
  );
}
