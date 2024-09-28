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
          <div className="">
            <h2 className="text-balance text-left text-base font-semibold  tracking-[-0.015em] text-black md:text-xl lg:text-3xl ">
              We provide end-to-end support for every step needed to actually
              effect change.
            </h2>
            <p className="mt-4 text-left  text-base/6 text-black">
              We match you with a high-impact nonprofit or ámaxa initiative,
              connect you to a team, and provide a coach to guide you with 1-1
              support. We train you in proven project management methods and
              build features in our web app to solve the problems, however
              minute, you identify. You drive the impact, and we ensure the
              tools and support are in place to make it happen.
            </p>
          </div>
        </WobbleCard>
        <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-background border">
          <h2 className="max-w-80  text-balance text-left text-base font-semibold tracking-[-0.015em] text-black md:text-xl lg:text-3xl">
            We are accessible across income and location.
          </h2>
          <p className="mt-4 max-w-[26rem] text-left  text-base/6 ">
            The program is 100% remote, and our members have come from 26
            countries. Our annual membership fee is $150, but we offer
            scholarships to any student in need. Last year, two-thirds of our
            members received partial or full scholarships.
          </p>
        </WobbleCard>
        <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-background border">
          <h2 className="max-w-80  text-balance text-left text-base font-semibold tracking-[-0.015em] text-black md:text-xl lg:text-3xl">
            We are a community.
          </h2>
          <p className="mt-4 max-w-[26rem] text-left  text-base/6 ">
            Our members form friendships on their teams through months of
            working together. They meet members from our other teams through our
            remote events, ranging from casual meetups to guest speaker
            seminars.
          </p>
        </WobbleCard>
        <WobbleCard containerClassName="col-span-1 lg:col-span-2 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px] bg-background border">
          <div className="max-w-sm">
            <h2 className="max-w-sm text-balance  text-left text-base font-semibold tracking-[-0.015em] text-black md:max-w-lg md:text-xl lg:text-3xl">
              We are tech-centered.
            </h2>
            <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-black">
              Our online platform, designed, build, and deployed by our
              16-year-old CTO Ani Chenjeri, is built to solve the specific
              problems ámaxa teams face. We value our members’ feedback above
              all and design features directly based on your needs.
            </p>
          </div>
          <Image
            src="https://s3-alpha-sig.figma.com/img/d1fd/e660/fd30bcfc25ed13bcbb3f12229164602b?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Ub-OBd8QKD1r~ESzMVzsZjcZE1s2c6ctJfvfUZXA4Na37vkCi5OHZDGi0a3L5PzW6zxQ2fFHN0wZ0NPEZjMbVGbpPE6eDUrOwFEK2EumfUkULfhpKvrj-gGv-Cf7TEYxn9U0ai7AiE933yrnP5-~lBfBu0Na-i2GN1O9ItV2YaiKZMABWoboSCVabv5oOUIt9SYesZeNbOnsnHy9j~NrMD9Shpp8yHE8xGn6ukqGB0Kzt60i3vxcJvwI6oj99S4ZgrtDGdsepvDfN-iKvR2WXgBAriDGEMAPeZFl-h36dd7be-JAzu4qIlHH0CO8KuVnbNMIy-rfH0ogbAT8liSpIQ__"
            width={500}
            height={500}
            alt="linear demo image"
            className="absolute -bottom-[105] rounded-2xl object-contain md:-right-[15%] lg:-left-[-50%]"
          />
        </WobbleCard>
      </div>
    </section>
  );
}
