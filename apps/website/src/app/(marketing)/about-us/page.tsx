"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Globe,
  Heart,
  Lightbulb,
  QuoteIcon,
  Rocket,
  Users,
  Zap,
} from "lucide-react";

import { buttonVariants } from "@amaxa/ui/button";
import { Card, CardContent } from "@amaxa/ui/card";

import WhatMakesUsDiffrent from "../_components/different";
import HowItWorks from "../_components/how-it-works";
import ProgramInfo from "./_components/program-info";
import { StoriesCarousel } from "./_components/student-stories";

export default function AmaxaAboutUs() {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="min-h-screen w-full text-foreground">
      <Hero />
      <TestimonialComponent />
      <Impact />
      <StoriesCarousel />
      <HowItWorks />
      <ProgramInfo />
      <Mission />
      <WhatMakesUsDiffrent />
      <div className="h-[32px]" />
      <TechImpact />
    </div>
  );
}
function Hero() {
  return (
    <section className="flex min-h-screen items-center justify-center pt-16">
      <div className="px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 text-4xl font-bold md:text-6xl"
        >
          About Ámaxa
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mb-8 max-w-2xl text-xl md:text-2xl"
        >
          Empowering passionate individuals to make a profound difference in the
          world.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
        >
          <ArrowDown className="mx-auto h-8 w-8 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}

function Mission() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: any) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
  };

  return (
    <section ref={ref} className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
          Our Mission
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              icon: Heart,
              title: "Remove Barriers",
              description:
                "We connect passionate individuals to high-impact projects, overcoming scheduling conflicts and accessibility issues.",
            },
            {
              icon: Lightbulb,
              title: "Innovative Projects",
              description:
                "We offer unique, community-driven initiatives across 9 global nonprofits and original Ámaxa programs.",
            },
            {
              icon: Rocket,
              title: "Empower Youth",
              description:
                "We believe in the power of young people to create real change, treating students as global leaders.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={i}
            >
              <Card>
                <CardContent className="p-6">
                  <item.icon className="mb-4 h-12 w-12 text-primary" />
                  <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                  <p>{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Impact() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.8, 1, 1, 0.8],
  );

  return (
    <motion.section ref={ref} style={{ opacity, scale }} className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
          Our Impact
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            { icon: Globe, number: 46, text: "Countries Represented" },
            { icon: Users, number: 231, text: "Student Applicants" },
            { icon: Zap, number: 22, text: "Completed Projects" },
          ].map((item, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <item.icon className="mx-auto mb-4 h-12 w-12 text-primary" />
                <motion.h3
                  className="mb-2 text-4xl font-bold"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {item.number}
                </motion.h3>
                <p>{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function TechImpact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="rounded-3xl bg-primary py-16 text-primary-foreground"
    >
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-3xl font-bold md:text-4xl"
        >
          Scaling Our Impact Through Technology
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mb-8 max-w-2xl text-xl"
        >
          With 4 out of 7 leadership team members having Computer Science
          backgrounds, we're leveraging technology to amplify our impact. Our
          online platform features over 22 innovative tools designed to address
          real challenges faced by our users.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href={"/platform"}
            className={buttonVariants({
              size: "md",
              variant: "secondary",
            })}
          >
            Join Our Tech-Driven Movement
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
const TestimonialComponent = () => (
  <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 to-primary/25 shadow-lg">
    <div className="flex flex-col md:flex-row">
      <div className="relative h-64 md:h-auto md:w-1/3">
        <Image
          alt="Lauren McMillen"
          layout="fill"
          objectFit="cover"
          className="rounded-xl md:rounded-none"
          src="/lauren-headshot.png"
        />
        <div className="absolute bottom-4 right-4 rounded-full bg-primary p-3 text-white shadow-lg">
          <QuoteIcon size={24} />
        </div>
      </div>
      <div className="p-6 md:w-2/3 md:p-12">
        <blockquote className="text-gray-800">
          <p className="mb-6 text-lg leading-relaxed md:text-xl">
            When I was 16, my teacher Mr. Boyce believed in me. With his
            mentorship, I raised $10,000 to purchase solar panels for a school
            in Uganda. This experience taught me how to be impactful, and it
            changed my life - but only because I was fortunate enough to meet
            Mr. Boyce.
          </p>
          <p className="mb-6 text-lg leading-relaxed md:text-xl">
            My story highlights a much larger issue: it's too difficult for
            people who want to make a difference to actually do it. Individuals
            facing poverty, conflict, and other challenges could be profoundly
            impacted if more of us knew how to turn our passion into meaningful
            change.
          </p>
          <p className="mb-6 text-lg leading-relaxed md:text-xl">
            That's why I founded Amaxa. We're dedicated to empowering the next
            generation of changemakers, providing them with the tools,
            resources, and mentorship they need to create lasting positive
            impact in their communities and beyond.
          </p>
          <p className="text-lg leading-relaxed md:text-xl">
            Together, we can break down the barriers that prevent passionate
            individuals from making a difference. We believe that everyone has
            the potential to change the world - they just need the right support
            and guidance to unlock that potential.
          </p>
        </blockquote>
        <footer className="mt-8">
          <p className="text-xl font-semibold text-gray-900">Lauren McMillen</p>
          <p className="text-lg font-medium text-primary">
            CEO & Founder, Amaxa
          </p>
        </footer>
      </div>
    </div>
  </div>
);
