"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { ColourfulText } from "@/components/ui/colourful-text";
import { FocusCards } from "@/components/ui/focus-cards-many";
import { LinkPreview } from "@/components/ui/link-preview";
import { WobbleCard } from "@/components/ui/wobble-card";
import { motion } from "motion/react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@amaxa/ui/tabs";

import { ApplyButton } from "~/components/apply";
import { ProfileCard } from "./_components/people";

export const cards = [
  {
    title:
      "Created Accessifyed educational platform for the ISNAD Center in Palestine",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOQI4SoEOsmkEelahd1WSuvzRG6jICN9HqcOF3",
    link: "",
    description: "",
  },
  {
    title: "Planted trees across Turkey, US, and the UAE",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOVscvGzWL0MYRHUetxwcyzJn3h7alsSdIDAKf",
    link: "",
    description: "",
  },
  {
    title:
      "Raised $700 for Gazans through student concert in USA and basketball tournament in Qatar",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToO1yec3BZuh38756znQ1WsobkyBqTCiLE0ramM",
    link: "",
    description: "",
  },
  {
    title:
      "Paid full year tuition for 7 students in Liberia through martial arts tournament and bake sale",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOaVg3qCIBDGmcbISEzQYZx81iL0rWJ43h2T9d",
    link: "",
    description: "",
  },
  {
    title: "Raised $500 for medical supplies for Ukrainian civilians",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOaVg3qCIBDGmcbISEzQYZx81iL0rWJ43h2T9d",
    link: "",
    description: "",
  },
  {
    title:
      "Launched Student Ambassador group for cohort students who showed exceptional committment and passion",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOVscvGzWL0MYRHUetxwcyzJn3h7alsSdIDAKf",
    link: "",
    description: "",
  },
  {
    title: "Launched our first in-person pathway, the Colorado Ámaxa network",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOaVg3qCIBDGmcbISEzQYZx81iL0rWJ43h2T9d",
    link: "",
    description: "",
  },
  {
    title:
      "Ongoing: providing artist Piera van de Wiel with a trained PR team to promote her documentary on LGBTQ+ refugees",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToO1yec3BZuh38756znQ1WsobkyBqTCiLE0ramM",
    link: "",
    description: "",
  },
];

export const testimonials = [
  {
    quote:
      "The greatest lesson ámaxa taught me is that no matter how new you are at something, you still have potential to make a positive impact.",
    name: "Maitha",
    designation: "UAE",
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "My favorite part of the program was learning more about Educhildren, how political and social conflict has affected Liberia’s education system, brain drain, seeing the statistics on why students can’t progress- it was super interesting, but also super jarring.",
    name: "Lareb",
    designation: "UAE",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "Àmaxa taught me that if I have an idea that helps other people, I can develop it.",
    name: "Mohammed",
    designation: "Egypt",
    src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "In the beginning of this project, I thought it was impossible. I was scared and unsure. As time progressed, I realized that we could definitely create this change, with the right people and the right support, we can.",
    name: "Katelyn",
    designation: "USA",
    src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "After ámaxa, I will already know how to better communicate within a team, how to organize a project from scratch, and above all, how to overcome obstacles that arise.",
    name: "Otilia",
    designation: "Romania",
    src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function WhoAreWePage() {
  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 text-[#3B3B3B] md:px-16 lg:px-20">
        <div className="relative flex h-[400px] w-full items-center justify-center overflow-hidden bg-black">
          <motion.img
            src=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover [mask-image:radial-gradient(circle,transparent,black_80%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1 }}
          />
          <h1 className="relative z-10 max-w-4xl px-6 text-left text-3xl font-bold text-white">
            Àmaxa’s mission is to make it easier for people who want to make a
            difference to <ColourfulText text="actually take action" /> — not
            just feel stuck in that “I want to help, but I don’t know how”
            feeling.
          </h1>
        </div>
      </section>
      {/* About Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 text-[#3B3B3B] md:px-16 lg:px-20">
        <h3 className="mb-8 text-3xl font-normal md:text-4xl lg:text-5xl">
          ámaxa takes chance out of making change.
        </h3>
        <p className="mb-6 max-w-4xl text-lg">
          1. Through Ámaxa Pathways, we match you to a project with a clear goal
          at one of our 9 partner nonprofits & initiatives, a team of passionate
          peers, and a trained coach. The program is 100% remote.{" "}
        </p>
        <p className="mb-6 max-w-4xl text-lg">
          2. Then, over 3 months, you meet weekly on Zoom to plan & accomplish
          your project in the way that best highlights your team’s passions &
          strengths.
        </p>
        <p className="mb-6 max-w-4xl text-lg">
          3. Along the way, you implement project management methodologies
          designed specifically for ámaxa projects & utilize the tools and
          resources in our custom online platform.{" "}
        </p>
      </section>
      {/* Pathways Intro */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-16 lg:px-20">
        <h2 className="max-w-5xl text-3xl font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl">
          Explore the ámaxa pathway for you.
        </h2>
      </section>
      {/* Pathways Cards */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:px-16 lg:grid-cols-2 lg:px-20">
        {/* Pathways cards */}
        {/* <div className="grid grid-cols-2 gap-4 max-w-7xl mx-auto w-full"> */}

        <Link
          href="/pathways/cohorts"
          target=""
          className="col-span-1 lg:col-span-1"
        >
          <WobbleCard
            containerClassName="col-span-2 lg:col-span-1 max-h-[320px]"
            className=""
          >
            <h2 className="max-w-sm text-balance text-left text-base font-semibold tracking-[-0.015em] text-white md:max-w-lg md:text-xl lg:text-3xl">
              Ámaxa Cohorts, for high school students{" "}
            </h2>
            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
              Through our 3-month remote program, students work in a remote team
              of your peers, guided by a coach, to effect measurable change
              through one of our 9 partner nonprofits or original initiatives.
            </p>
            <img
              src="https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOVJDCilWL0MYRHUetxwcyzJn3h7alsSdIDAKf"
              width={500}
              height={500}
              alt="linear demo image"
              className="absolute -bottom-40 -right-10 rounded-2xl object-contain md:-right-[70%] lg:-right-[30%]"
            />
          </WobbleCard>
        </Link>

        <Link
          href="/pathways/research"
          target=""
          className="col-span-1 lg:col-span-1"
        >
          <WobbleCard containerClassName="col-span-2 lg:col-span-1 min-h-[320px]">
            <h2 className="max-w-sm text-balance text-left text-base font-semibold tracking-[-0.015em] text-white md:max-w-lg md:text-xl lg:text-3xl">
              Ámaxa Research for: undergrad & postgrad students
            </h2>
            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
              Ámaxa Research’s mission is to conduct, write, and publish
              original research on questions critical to the work of our partner
              nonprofits and initiatives.{" "}
            </p>
            <img
              src="https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOjxcCpDmYZFtMKdGCwhkEePg27zV39qyDB0mr"
              width={500}
              height={500}
              alt="linear demo image"
              className="absolute -bottom-40 -right-10 rounded-2xl object-contain md:-right-[70%] lg:-right-[10%]"
            />
          </WobbleCard>
        </Link>

        <Link
          href="/pathways/partnerships"
          target=""
          className="col-span-1 lg:col-span-1"
        >
          <WobbleCard containerClassName="col-span-2 lg:col-span-1 max-h-[320px]">
            <h2 className="max-w-sm text-balance text-left text-base font-semibold tracking-[-0.015em] text-white md:max-w-lg md:text-xl lg:text-3xl">
              Ámaxa Partnerships, for professionals
            </h2>
            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
              The model of Ámaxa Partnerships recognizes that the greatest
              capacity for tangible change professionals possess is the ability
              to raise funds through corporate partnerships and donations via
              each of our networks.
            </p>
            <img
              src="https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOaLemsuIBDGmcbISEzQYZx81iL0rWJ43h2T9d"
              width={450}
              height={450}
              alt="linear demo image"
              className="absolute -right-20 -top-[20%] -z-10 rounded-2xl object-contain md:-right-[70%] lg:-right-[2%]"
            />
          </WobbleCard>
        </Link>

        <Link
          href="/pathways/network"
          target=""
          className="col-span-1 lg:col-span-1"
        >
          <WobbleCard containerClassName="col-span-2 lg:col-span-1 max-h-[320px]">
            <div className="max-w-sm">
              <h2 className="max-w-sm text-balance text-left text-base font-semibold tracking-[-0.015em] text-white md:max-w-lg md:text-xl lg:text-3xl">
                Ámaxa Network, for Coloradans
              </h2>
              <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                An open invitation for individuals in Colorado who are doing
                great things to effect change and space to congregate both
                digitally & in-person
              </p>
            </div>
            <img
              src="https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToONU0PJlDesbBzAkMUD2VgJC8t15PQoqpLNrjf"
              width={500}
              height={500}
              alt="linear demo image"
              className="absolute -bottom-20 -right-10 rounded-2xl object-contain md:-right-[70%] lg:-right-[10%]"
            />
          </WobbleCard>
        </Link>
      </div>
      {/* Testimonials Intro */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-16 lg:px-20">
        <h2 className="max-w-5xl text-3xl font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl">
          What our students have said:
        </h2>
      </section>
      {/* Testimonials Component */}
      <div className="mx-auto max-w-7xl px-6 md:px-16 lg:px-20">
        <AnimatedTestimonials testimonials={testimonials} />
      </div>
      {/* Student Impact Intro */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-16 lg:px-20">
        <h2 className="max-w-5xl text-3xl font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl">
          What our students have done:
        </h2>
      </section>
      ...
      {/* Student Impact Details */}
      <div className="mx-auto max-w-7xl space-y-10 px-6 py-8 md:px-16 lg:px-20">
        <p className="max-w-3xl text-lg text-neutral-500 dark:text-neutral-400 md:text-xl">
          Created an
          <LinkPreview
            url="https://tailwindcss.com"
            className="bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent"
          >
            educational platform
          </LinkPreview>{" "}
          for the ISNAD Center in Palestine.
        </p>

        <p className="max-w-3xl text-lg text-neutral-500 dark:text-neutral-400 md:text-xl">
          Raised $700 for Gazans through
          <LinkPreview
            url="https://tailwindcss.com"
            className="bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent"
          >
            a benefit concert in Georgia, USA
          </LinkPreview>{" "}
          and
          <LinkPreview
            url="https://tailwindcss.com"
            className="bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent"
          >
            a basketball tournament in Doha, Qatar
          </LinkPreview>
          .
        </p>

        <p className="max-w-3xl text-lg text-neutral-500 dark:text-neutral-400 md:text-xl">
          Paid
          <LinkPreview
            url="https://tailwindcss.com"
            className="bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent"
          >
            full year tuition for 7 students in Liberia
          </LinkPreview>{" "}
          through
          <LinkPreview
            url="https://tailwindcss.com"
            className="bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent"
          >
            a martial arts tournament and bake sale
          </LinkPreview>
          .
        </p>

        <p className="max-w-3xl text-lg text-neutral-500 dark:text-neutral-400 md:text-xl">
          Raised $500 for
          <LinkPreview
            url="https://tailwindcss.com"
            className="bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent"
          >
            medical supplies for Ukrainian citizens
          </LinkPreview>
          .
        </p>

        <p className="max-w-3xl text-lg text-neutral-500 dark:text-neutral-400 md:text-xl">
          We are providing PR for artist Piera van de Wiel to promote a
          <LinkPreview
            url="https://tailwindcss.com"
            className="bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent"
          >
            documentary on LGBTQ+ refugees
          </LinkPreview>
          .
        </p>

        <p className="max-w-3xl text-lg text-neutral-500 dark:text-neutral-400 md:text-xl">
          Creating educational and cultural remote exchanges for
          <LinkPreview
            url="https://tailwindcss.com"
            className="bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent"
          >
            high school girls in the West Bank, Palestine
          </LinkPreview>{" "}
          with other students from around the globe.
        </p>
      </div>
      ...
      {/* Vision CTA Section */}
      <section className="bg-[#F5F2F2] py-16 md:py-24 lg:py-32">
        <div className="px-6 md:px-16 lg:px-20">
          <h2 className="mb-12 max-w-5xl text-3xl font-normal leading-tight text-[#3B3B3B] md:text-4xl lg:text-5xl">
            Join us in our vision of 10,000 ámaxa members by 2030.
          </h2>
          <div className="flex flex-wrap gap-4">
            <ApplyButton variant="black">Contact Us</ApplyButton>
            <ApplyButton variant="black">Support Us</ApplyButton>
          </div>
        </div>
      </section>
      <section className="mx-auto w-full max-w-7xl">
        <div className="relative flex h-[600px] w-full items-center justify-center overflow-hidden bg-black">
          <motion.img
            src="https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOexh9L5yvrS3NH5LD0fGBOXwFydpiVbYzJMa1"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover [mask-image:radial-gradient(circle,transparent,black_80%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1 }}
          />
          <h1 className="z-2 relative w-[1000px] text-center text-4xl font-bold text-white">
            Àmaxa’s mission is to make it easier for people who want to make a
            difference to <ColourfulText text="actually take action" /> — not
            just feel stuck in that “I want to help, but I don’t know how”
            feeling.
          </h1>
        </div>

        <section className="w-full py-16 md:py-24">
          <div className="">
            <h2 className="max-w-5xl text-3xl font-normal leading-tight text-[#3B3B3B] md:text-4xl lg:text-5xl">
              So, we aim to take care of every aspect of what stops people- when
              you have that “but how do I start feeling”- the right nonprofit to
              help, who will do it with you, someone to guide you, and how to
              manage the project, all remotely.
            </h2>
          </div>
        </section>

        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-4">
          <p className="mb-6 text-lg">
            {" "}
            Our first pathway launched in 2023 for high school students. We
            match each student with one of our nonprofit partners- working in
            areas like education, mental health, refugee support, and more- a
            small team of peers, and a trained coach. Over three months, they
            meet weekly over Zoom and work together on a project—some have
            created educational platforms for students in Palestine, planted
            trees across three countries, raised funds for medical aid in
            Ukraine, paid tuition for Liberian students, and more. A core part
            of our mission is accessibility: the program is 100% remote and
            scholarship-backed, so any student who wants to make a difference
            can do so, regardless of financial background.
          </p>
        </div>

        {/* More paragraph about my story
         */}

        {/* Brief: What We Do - 3 steps in text
         */}

        <section className="w-full py-16 md:py-24">
          <div className="">
            <h2 className="max-w-5xl text-3xl font-normal leading-tight text-[#3B3B3B] md:text-4xl lg:text-5xl">
              Explore the ámaxa pathway for you.
            </h2>
          </div>
        </section>

        {/* Pathways cards */}
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-4">
          <Link
            href="/pathways/cohorts"
            target=""
            className="col-span-1 lg:col-span-1"
          >
            <WobbleCard
              containerClassName="col-span-2 lg:col-span-1 max-h-[320px]"
              className=""
            >
              <h2 className="max-w-sm text-balance text-left text-base font-semibold tracking-[-0.015em] text-white md:max-w-lg md:text-xl lg:text-3xl">
                Ámaxa Cohorts, for high school students{" "}
              </h2>
              <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                Through our 3-month remote program, students work in a remote
                team of your peers, guided by a coach, to effect measurable
                change through one of our 9 partner nonprofits or original
                initiatives.
              </p>
              <img
                src="https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOVJDCilWL0MYRHUetxwcyzJn3h7alsSdIDAKf"
                width={500}
                height={500}
                alt="linear demo image"
                className="absolute -bottom-40 -right-10 rounded-2xl object-contain md:-right-[70%] lg:-right-[30%]"
              />
            </WobbleCard>
          </Link>

          <Link
            href="/pathways/research"
            target=""
            className="col-span-1 lg:col-span-1"
          >
            <WobbleCard containerClassName="col-span-2 lg:col-span-1 min-h-[320px]">
              <h2 className="max-w-sm text-balance text-left text-base font-semibold tracking-[-0.015em] text-white md:max-w-lg md:text-xl lg:text-3xl">
                Ámaxa Research for: undergrad & postgrad students
              </h2>
              <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                Ámaxa Research’s mission is to conduct, write, and publish
                original research on questions critical to the work of our
                partner nonprofits and initiatives.{" "}
              </p>
              <img
                src="https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOjxcCpDmYZFtMKdGCwhkEePg27zV39qyDB0mr"
                width={500}
                height={500}
                alt="linear demo image"
                className="absolute -bottom-40 -right-10 rounded-2xl object-contain md:-right-[70%] lg:-right-[10%]"
              />
            </WobbleCard>
          </Link>

          <Link
            href="/pathways/partnerships"
            target=""
            className="col-span-1 lg:col-span-1"
          >
            <WobbleCard containerClassName="col-span-2 lg:col-span-1 max-h-[320px]">
              <h2 className="max-w-sm text-balance text-left text-base font-semibold tracking-[-0.015em] text-white md:max-w-lg md:text-xl lg:text-3xl">
                Ámaxa Partnerships, for professionals
              </h2>
              <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                The model of Ámaxa Partnerships recognizes that the greatest
                capacity for tangible change professionals possess is the
                ability to raise funds through corporate partnerships and
                donations via each of our networks.
              </p>
              <img
                src="https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOaLemsuIBDGmcbISEzQYZx81iL0rWJ43h2T9d"
                width={450}
                height={450}
                alt="linear demo image"
                className="absolute -right-20 -top-[20%] -z-10 rounded-2xl object-contain md:-right-[70%] lg:-right-[2%]"
              />
            </WobbleCard>
          </Link>

          <Link
            href="/pathways/network"
            target=""
            className="col-span-1 lg:col-span-1"
          >
            <WobbleCard containerClassName="col-span-2 lg:col-span-1 max-h-[320px]">
              <div className="max-w-sm">
                <h2 className="max-w-sm text-balance text-left text-base font-semibold tracking-[-0.015em] text-white md:max-w-lg md:text-xl lg:text-3xl">
                  Ámaxa Network, for Coloradans
                </h2>
                <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                  An open invitation for individuals in Colorado who are doing
                  great things to effect change and space to congregate both
                  digitally & in-person
                </p>
              </div>
              <img
                src="https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToONU0PJlDesbBzAkMUD2VgJC8t15PQoqpLNrjf"
                width={500}
                height={500}
                alt="linear demo image"
                className="absolute -bottom-20 -right-10 rounded-2xl object-contain md:-right-[70%] lg:-right-[10%]"
              />
            </WobbleCard>
          </Link>
        </div>

        <section className="w-full py-16 md:py-24">
          <div className="">
            <h2 className="max-w-5xl text-3xl font-normal leading-tight text-[#3B3B3B] md:text-4xl lg:text-5xl">
              What our students have said:
            </h2>
          </div>
        </section>

        {/* Testimonials */}
        <div>
          <AnimatedTestimonials
            testimonials={testimonials}
          ></AnimatedTestimonials>
        </div>

        <section className="w-full py-16 md:py-24">
          <div className="">
            <h2 className="max-w-5xl text-3xl font-normal leading-tight text-[#3B3B3B] md:text-4xl lg:text-5xl">
              What our students have done:
            </h2>
          </div>
        </section>

        {/* Online Platform page */}

        <section className="bg-[#F5F2F2] py-16 md:py-24 lg:py-32">
          <div className="px-6 md:px-16 lg:px-20">
            {/* Main heading */}
            <h2 className="mb-12 max-w-5xl text-3xl font-normal leading-tight text-[#3B3B3B] md:mb-16 md:text-4xl lg:text-5xl">
              Join us in our vision of 10,000 ámaxa members by 2030.
            </h2>
            {/* Button */}
            <ApplyButton variant="black">Contact Us</ApplyButton>
            <ApplyButton variant="black">Support Us</ApplyButton>
            {/* <button ="https://airtable.com/appPR9mkslbn3U8YZ/shrHHUtRzK4DqKt3F" className="box-border flex justify-center items-center py-3 px-6 bg-white border border-[#3B3B3B] rounded-full">
            <span className="font-normal text-base md:text-lg text-[#3B3B3B]" >
              Apply Today →
            </span>
          </button> */}
          </div>
        </section>

        {/* Team Contact with carsd like pathways
         */}

        {/* 
            <section className="container mx-auto flex flex-col">
              <div className="flex flex-col gap-10 py-10 text-[#3B3B3B]">
                <section className="w-full px-6 md:px-16 lg:px-20">
                  <div className="mx-auto max-w-7xl">
                    <div className="space-y-16 md:space-y-24">
                      <div>
                        <h2 className="mb-4 text-2xl font-normal text-[#3B3B3B] md:text-3xl">
                        Our work is vital because it democratizes social impact, empowering individuals of any background or location to become active agents of change. 
                        </h2>
                        <p className="mb-6 max-w-3xl text-lg">
                   
                       Over 240 students have applied to our Cohort Program from 48 countries and counting. Fundamental to our mission is that our $150 program fee for the high school Cohorts pathway is accessible, with scholarships available for any student in need, closing the extracurricular gap for low-income students. Upon securing funding, we aim to get rid of the program fee entirely.

        
                        </p>  
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </section>
            <section className="container mx-auto flex flex-col">
              <div className="flex flex-col gap-10 py-10 text-[#3B3B3B]">
                <section className="w-full px-6 md:px-16 lg:px-20">
                  <div className="mx-auto max-w-7xl">
                    <div className="space-y-16 md:space-y-24">
                      <div>
                        <h2 className="mb-4 text-2xl font-normal text-[#3B3B3B] md:text-3xl">
                Supporting teen mental health is also an innate part of our mission.
                        </h2>
                        <p className="mb-6 max-w-3xl text-lg">
                        According to new research, such as this article in Scientific American, teens who help others experience reductions in depression and anxiety. One of the most <a className="underline" href="https://www.scientificamerican.com/article/teens-mental-health-may-improve-when-they-help-others/">striking findings</a>, for example, is that, in one study, after 30 hours of volunteer work, de­pressive symptoms [for teens aged 14-20] reduced an average of 19%. Our high school Cohort program averages 50 hours over the 3 month period and offers the opportunity to contribute to meaningful causes while connecting with peers and mentors globally which in turn fosters self-esteem and emotional well-being.
        
                        </p>  
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </section> */}
      </section>
    </main>
  );
}
