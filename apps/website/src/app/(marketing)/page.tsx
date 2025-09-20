"use client";

import React from "react";
import { FocusCards } from "@/components/ui/focus-cards-text";

import { ApplyButton } from "~/components/apply";
import Footer from "~/components/footer";
import SynchronizedCarousel from "./_sections/hero";
import { Projects } from "./_sections/projects";
import { Spotlight } from "./_sections/spotlight";

export const cards = [
  {
    title: "Ámaxa Cohorts",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOQI4SoEOsmkEelahd1WSuvzRG6jICN9HqcOF3",
    link: "/pathways/cohorts",
    description: "for high school students",
  },
  {
    title: "Ámaxa Research",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOVscvGzWL0MYRHUetxwcyzJn3h7alsSdIDAKf",
    link: "/pathways/research",
    description: "for undergrad & postgrad students",
  },
  {
    title: "Ámaxa Partnerships",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToO1yec3BZuh38756znQ1WsobkyBqTCiLE0ramM",
    link: "/pathways/partnerships",
    description: "for professionals",
  },
  {
    title: "Ámaxa Network",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOaVg3qCIBDGmcbISEzQYZx81iL0rWJ43h2T9d",
    link: "/pathways/network",
    description: "for students & professionals in Colorado",
  },
];

export default function Page() {
  return (
    <main>
      <SynchronizedCarousel />

      <section className="w-full bg-[#F5F2F2] py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-16 lg:px-20">
          <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
            <div className="mb-12 max-w-full md:mb-0 md:max-w-3xl lg:max-w-4xl">
              <p className="font-strong mb-8 max-w-3xl text-2xl">OUR MISSION</p>

              <p className="mb-8 max-w-3xl text-2xl font-light">
                For the first time in history, we can see in crystal clear
                detail the challenges faced by others across the world, and we
                can change that person's life across the world easier than ever
                before.{" "}
                <span className="italic">
                  Yet, it's still too hard for people who want to make a
                  difference to actually do it.
                </span>
              </p>

              <h1 className="text-4xl leading-tight text-[black] md:text-4xl lg:text-6xl">
                We are changing that.
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="lg:px-30 relative bg-white py-16">
        <div className="px-6 py-16 md:px-16 lg:px-20">
          {/* Main heading */}
          <h1 className="mb-8 text-3xl font-semibold leading-tight text-black md:text-4xl lg:text-5xl">
            Ámaxa Pathways takes you from start to finish of what's needed to
            truly effect change.
          </h1>
          <p className="mb-6 max-w-3xl text-lg">
            <strong>Hover or click</strong> below to explore the pathway right
            for you.
          </p>

          <FocusCards cards={cards} />
        </div>
      </section>

      <section className="relative w-full px-16">
        <Projects />
      </section>

      {/* <section className="flex flex-col items-start justify-center bg-[#F5F2F2] px-6 py-16 md:px-16 md:py-24 lg:px-20">
        <div className="relative mb-8 w-full">
          <h2 className="text-3xl font-normal leading-tight text-[#3B3B3B] md:text-4xl lg:text-5xl">
            ámaxa (άμαξα): Greek for vehicle
          </h2>
          <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 transform md:block">
            <svg
              width="200"
              height="40"
              viewBox="0 0 200 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-32 md:w-48 lg:w-56"
            >
              <path
                d="M1 20C1 20 40 5 60 20C80 35 120 5 140 20C160 35 199 20 199 20"
                stroke="#BCD96C"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <h2 className="max-w-5xl text-3xl font-normal leading-tight text-[#3B3B3B] md:text-4xl lg:text-5xl">
          We aim to be a{" "}
          <span className="font-semibold">vehicle for impact</span> for
          thousands of people globally.
        </h2>
      </section> */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="">
          <h2 className="px-16 font-sans text-xl font-bold text-neutral-800 dark:text-neutral-200 md:text-5xl">
            Ámaxa Stories
          </h2>

          {[
            {
              heading: "Member Spotlight",
              name: "How An Nhi Sequestered Carbon by Planting Trees",
              ageLocation: "Vietnam",
              paragraphs: [
                `
Her team planted three trees native to their communities in the US, Vietnam, and Turkey.  They completed measurements on the tree, and started the process of calculating the CO2 sequestration.
`,
                `
Guided by their coach, they implemented the project management techniques ámaxa developed based on 2 years of research and project iterations. 
`,
                `
By meeting remotely every week for 3 months, they raised the funds to purchase the seedlings for each tree. Then, they identified a suitable place to plant it. Finally, they measured the tree and calculated the CO2 each sequesters.
`,
              ],
              teammates: "Teammates: Mohamed (Turkey) & Lauryn (USA)",
              videoUrl:
                "https://player.vimeo.com/video/1069899673?h=0ef231b81a&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
              imageUrl: "",
            },
            {
              heading: "TEAM SPOTLIGHT",
              name: "How Isabella and Zobia's Love for Music Changed Lives in Gaza",
              ageLocation: "USA",
              paragraphs: [
                '"Change, in any capacity, can and should start with us." -Isabella',
                `
Through ámaxa’s student impact fellowship, and a partnership with the nonprofit Gaza Champions, Isabella, Zobia, and their program coach Delilah created Alliance Academy’s first “Melody of Alliance Fall Charity Concert”. After being told that the brainstormed event could happen in just two weeks, the team jumped into action. They had spent the few weeks prior getting an idea of their timeline based on their before-winter-break goal and now they’d met a crunch point where all tasks were vital to make the concert the best it could be. Isabella and Zobia worked together in and outside of the weekly meetings arranged by their coach to contact sponsors for the event’s raffle, create awesome marketing material, and make sure everything was approved by school authority. At the event, they had 20 attendants, 3 raffle prizes awarded, and almost $200 USD raised. The team reflected that they believe that they did an awesome job with the limited job they were given. A huge takeaway was to focus on what you are in control of.
`,
              ],
              teammates: "",
              videoUrl:
                "https://player.vimeo.com/video/1069887902?h=acd24c8d11&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
              imageUrl: "",
            },
            // {
            //   heading: "TEAM SPOTLIGHT",
            //   name: "Meet Panshul, Jad, and Yueqi.",
            //   ageLocation: "UAE, LEBANON, & CHINA",
            //   paragraphs: [
            //     `“Since almost all students in Palestine have access to the Web, we aim to create an interactive, educational website where students can find pre-recorded lessons by tutors who will be recruited by our team.” Driven by their combined passions for education and technology, Zhao (16, China), Jad (16, Lebanon), Noor (16, Qatar), and Panshul (14, UAE), led by coach Sibel, created Accessifyed, which now offers 16 math lessons and 10 English lessons with tutoring`,
            //     `Panshul, Jad, and Zhao are now Ámaxa Student Ambassadors. The ámaxa leadership team will provide 1-1 coaching and guidance to expand Accessifyed from an MVP to a scaled solution for all of ISNAD’s students.`,
            //     `“My team members proved to be some of the most ambitious people with a strong wish to make a change. They approached the project wholeheartedly and wanted to put in the work to make something that would stay an important part of online, accessible education.” -Sibel, Team Coach`,
            //   ],
            //   teammates: "",
            //   videoUrl: "",
            // },
          ].map((spotlight, idx) => (
            <Spotlight key={idx} spotlightData={spotlight} />
          ))}

          <button className="mx-16 box-border flex items-center justify-center rounded-full border border-[#3B3B3B] bg-white px-6 py-3">
            <a href="/project-stories">
              <span className="text-base font-normal text-[#3B3B3B] md:text-lg">
                View All Stories →
              </span>
            </a>
          </button>
        </div>
      </section>

      <section className="bg-[#F5F2F2] py-16 md:py-24 lg:py-32">
        <div className="px-6 md:px-16 lg:px-20">
          {/* Main heading */}
          <h2 className="mb-12 max-w-5xl text-3xl font-normal leading-tight text-[#3B3B3B] md:mb-16 md:text-4xl lg:text-5xl">
            We want to build a world where anyone who wants to help the world
            can do it.
          </h2>

          {/* Button */}
          <button className="box-border flex items-center justify-center rounded-full border border-[#3B3B3B] bg-white px-6 py-3">
            <span className="text-base font-normal text-[#3B3B3B] md:text-lg">
              Support Our Vision →
            </span>
          </button>
        </div>
      </section>
      {/* <Footer></Footer> */}
    </main>
  );
}
