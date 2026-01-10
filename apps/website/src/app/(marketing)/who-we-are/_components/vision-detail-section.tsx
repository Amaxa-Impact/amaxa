"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { WobbleCard } from "@/components/ui/wobble-card";

export function VisionDetailSection() {
  return (
    <>
      <section className="w-full py-16 md:py-24">
        <div className="">
          <h2 className="max-w-5xl text-3xl leading-tight font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl">
            So, we aim to take care of every aspect of what stops people- when
            you have that "but how do I start feeling"- the right nonprofit to
            help, who will do it with you, someone to guide you, and how to
            manage the project, all remotely.
          </h2>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-4">
        <p className="mb-6 text-lg">
          {" "}
          Our first pathway launched in 2023 for high school students. We match
          each student with one of our nonprofit partners- working in areas like
          education, mental health, refugee support, and more- a small team of
          peers, and a trained coach. Over three months, they meet weekly over
          Zoom and work together on a project—some have created educational
          platforms for students in Palestine, planted trees across three
          countries, raised funds for medical aid in Ukraine, paid tuition for
          Liberian students, and more. A core part of our mission is
          accessibility: the program is 100% remote and scholarship-backed, so
          any student who wants to make a difference can do so, regardless of
          financial background.
        </p>
      </div>

      <section className="w-full py-16 md:py-24">
        <div className="">
          <h2 className="max-w-5xl text-3xl leading-tight font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl">
            Explore the ámaxa pathway for you.
          </h2>
        </div>
      </section>

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
            <h2 className="max-w-sm text-left text-base font-semibold tracking-[-0.015em] text-balance text-white md:max-w-lg md:text-xl lg:text-3xl">
              Ámaxa Cohorts, for high school students{" "}
            </h2>
            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
              Through our 3-month remote program, students work in a remote team
              of your peers, guided by a coach, to effect measurable change
              through one of our 9 partner nonprofits or original initiatives.
            </p>
            <Image
              src="https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOVJDCilWL0MYRHUetxwcyzJn3h7alsSdIDAKf"
              width={500}
              height={500}
              alt="linear demo image"
              className="absolute -right-10 -bottom-40 rounded-2xl object-contain md:-right-[70%] lg:-right-[30%]"
            />
          </WobbleCard>
        </Link>

        <Link
          href="/pathways/research"
          target=""
          className="col-span-1 lg:col-span-1"
        >
          <WobbleCard containerClassName="col-span-2 lg:col-span-1 min-h-[320px]">
            <h2 className="max-w-sm text-left text-base font-semibold tracking-[-0.015em] text-balance text-white md:max-w-lg md:text-xl lg:text-3xl">
              Ámaxa Research for: undergrad & postgrad students
            </h2>
            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
              Ámaxa Research's mission is to conduct, write, and publish
              original research on questions critical to the work of our partner
              nonprofits and initiatives.{" "}
            </p>
            <Image
              src="https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOjxcCpDmYZFtMKdGCwhkEePg27zV39qyDB0mr"
              width={500}
              height={500}
              alt="linear demo image"
              className="absolute -right-10 -bottom-40 rounded-2xl object-contain md:-right-[70%] lg:-right-[10%]"
            />
          </WobbleCard>
        </Link>

        <Link
          href="/pathways/partnerships"
          target=""
          className="col-span-1 lg:col-span-1"
        >
          <WobbleCard containerClassName="col-span-2 lg:col-span-1 max-h-[320px]">
            <h2 className="max-w-sm text-left text-base font-semibold tracking-[-0.015em] text-balance text-white md:max-w-lg md:text-xl lg:text-3xl">
              Ámaxa Partnerships, for professionals
            </h2>
            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
              The model of Ámaxa Partnerships recognizes that the greatest
              capacity for tangible change professionals possess is the ability
              to raise funds through corporate partnerships and donations via
              each of our networks.
            </p>
            <Image
              src="https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOaLemsuIBDGmcbISEzQYZx81iL0rWJ43h2T9d"
              width={450}
              height={450}
              alt="linear demo image"
              className="absolute -top-[20%] -right-20 -z-10 rounded-2xl object-contain md:-right-[70%] lg:-right-[2%]"
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
              <h2 className="max-w-sm text-left text-base font-semibold tracking-[-0.015em] text-balance text-white md:max-w-lg md:text-xl lg:text-3xl">
                Ámaxa Network, for Coloradans
              </h2>
              <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                An open invitation for individuals in Colorado who are doing
                great things to effect change and space to congregate both
                digitally & in-person
              </p>
            </div>
            <Image
              src="https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToONU0PJlDesbBzAkMUD2VgJC8t15PQoqpLNrjf"
              width={500}
              height={500}
              alt="linear demo image"
              className="absolute -right-10 -bottom-20 rounded-2xl object-contain md:-right-[70%] lg:-right-[10%]"
            />
          </WobbleCard>
        </Link>
      </div>
    </>
  );
}
