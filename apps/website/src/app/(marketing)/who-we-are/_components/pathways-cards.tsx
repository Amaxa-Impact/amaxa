"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { WobbleCard } from "@/components/ui/wobble-card";

export function PathwaysCards() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:px-16 lg:grid-cols-2 lg:px-20">
      <Link
        href="/pathways/cohorts"
        target=""
        className="col-span-1 lg:col-span-1"
      >
        <WobbleCard
          containerClassName="col-span-2 lg:col-span-1 max-h-[320px]"
          className=""
        >
          <Image
            src="https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOVJDCilWL0MYRHUetxwcyzJn3h7alsSdIDAKf"
            width={500}
            height={500}
            alt="linear demo image"
            className="absolute -right-10 -bottom-40 -z-10 rounded-2xl object-contain brightness-75 filter md:-right-[70%] lg:-right-[30%]"
          />
          <div className="absolute inset-0 -z-20 rounded-2xl bg-[#0E101F]/40"></div>
          <h2 className="max-w-sm text-left text-base font-semibold tracking-[-0.015em] text-balance text-white md:max-w-lg md:text-xl lg:text-3xl">
            Ámaxa Cohorts, for high school students{" "}
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
            End-to-end support to turn ideas into change
          </p>
        </WobbleCard>
      </Link>

      <Link
        href="/pathways/research"
        target=""
        className="col-span-1 lg:col-span-1"
      >
        <WobbleCard containerClassName="col-span-2 lg:col-span-1 max-h-[320px]">
          <Image
            src="https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOjxcCpDmYZFtMKdGCwhkEePg27zV39qyDB0mr"
            width={500}
            height={500}
            alt="linear demo image"
            className="absolute -right-10 -bottom-40 -z-10 rounded-2xl object-contain brightness-75 filter md:-right-[70%] lg:-right-[10%]"
          />

          <div className="absolute inset-0 -z-20 rounded-2xl bg-[#0E101F]/40"></div>
          <h2 className="max-w-sm text-left text-base font-semibold tracking-[-0.015em] text-balance text-white md:max-w-lg md:text-xl lg:text-3xl">
            Ámaxa Research for: undergrad & postgrad students
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
            Real research for real change.{" "}
          </p>
        </WobbleCard>
      </Link>

      <Link
        href="/pathways/partnerships"
        target=""
        className="col-span-1 lg:col-span-1"
      >
        <WobbleCard containerClassName="col-span-2 lg:col-span-1 max-h-[320px]">
          <Image
            src="https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOaLemsuIBDGmcbISEzQYZx81iL0rWJ43h2T9d"
            width={600}
            height={600}
            alt="linear demo image"
            className="absolute -top-[30%] -z-10 rounded-2xl object-contain brightness-75 filter md:-right-[70%] lg:-right-[-0%]"
          />
          <div className="absolute inset-0 -z-20 rounded-2xl bg-[#0E101F]/40"></div>
          <h2 className="max-w-sm text-left text-base font-semibold tracking-[-0.015em] text-balance text-white md:max-w-lg md:text-xl lg:text-3xl">
            Ámaxa Partnerships, for professionals
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
            Unlock your capacity to change lives through networks.
          </p>
        </WobbleCard>
      </Link>

      <Link
        href="/pathways/network"
        target=""
        className="col-span-1 lg:col-span-1"
      >
        <WobbleCard containerClassName="col-span-2 lg:col-span-1 max-h-[320px]">
          <Image
            src="https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToONU0PJlDesbBzAkMUD2VgJC8t15PQoqpLNrjf"
            width={500}
            height={500}
            alt="linear demo image"
            className="absolute -right-10 -bottom-20 rounded-2xl object-contain brightness-75 filter md:-right-[70%] lg:-right-[10%]"
          />
          <div className="absolute inset-0 -z-20 rounded-2xl bg-[#0E101F]/40"></div>
          <div className="max-w-sm">
            <h2 className="max-w-sm text-left text-base font-semibold tracking-[-0.015em] text-balance text-white md:max-w-lg md:text-xl lg:text-3xl">
              Ámaxa Network, for Coloradans
            </h2>
            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
              Connect with changemakers in Colorado
            </p>
          </div>
        </WobbleCard>
      </Link>
    </div>
  );
}
