import React from "react";
import Image from "next/image";
import { WobbleCard } from "@/components/ui/wobble-card";

export default function WhatMakesUsDiffrent() {
  return (
    <section className="flex w-full flex-col items-start ">
      <h1 className="pb-10 text-5xl font-bold text-black">
        What makes us different
      </h1>

      <div className="mx-auto grid w-full max-w-full grid-cols-1 gap-4 lg:grid-cols-3">
        <WobbleCard
          containerClassName="col-span-1 lg:col-span-2  text-black h-full bg-background border min-h-[500px] lg:min-h-[300px]"
          className=""
        >
          <div className="max-w-xs">
            <h2 className="text-balance text-left text-base font-semibold  tracking-[-0.015em] text-black md:text-xl lg:text-3xl ">
              We are tech centered
            </h2>
            <p className="mt-4 text-left  text-base/6 text-black">
              After a year of refining our model, we are ready to scale our
              community - and our community’s impact - with the ámaxa app.
            </p>
          </div>
          <Image
            src="/dashboard.png"
            width={500}
            height={500}
            alt="linear demo image"
            className="absolute -bottom-10 -right-4 rounded-2xl object-contain grayscale filter lg:-right-[40%]"
          />
        </WobbleCard>
        <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-background border">
          <h2 className="max-w-80  text-balance text-left text-base font-semibold tracking-[-0.015em] text-black md:text-xl lg:text-3xl">
            Our projects are innovative and community-founded.
          </h2>
          <p className="mt-4 max-w-[26rem] text-left  text-base/6 ">
            For instance, our partner in Ghana, Moving Health, constructs
            cost-effective ambulances to transport mothers in labor to
            hospitals.
          </p>
        </WobbleCard>
        <WobbleCard containerClassName="col-span-1 lg:col-span-3 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px] bg-background border">
          <div className="max-w-sm">
            <h2 className="max-w-sm text-balance  text-left text-base font-semibold tracking-[-0.015em] text-black md:max-w-lg md:text-xl lg:text-3xl">
              We match you to a remote team with members from around the world
              and an expert coach to guide you.
            </h2>
            <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-black">
              Our operating model looks very different from what one usually
              thinks of when they imagine volunteering programs. We not only
              match our members to an innovative project, but also to a team and
              a coach. Through implementing creative, ambitious projects of
              their own design, our students build skills well beyond those
              gleaned from a more typical volunteering experience, such as
              leadership, project management, global understanding, and
              tolerance for discomfort and risk.
            </p>
          </div>
          <Image
            src="/isnad.jpeg"
            width={500}
            height={500}
            alt="linear demo image"
            className="absolute -bottom-[-75] rounded-2xl object-contain md:-right-[15%] lg:-left-[-50%]"
          />
        </WobbleCard>
      </div>
    </section>
  );
}
