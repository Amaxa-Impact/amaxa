"use client";

import React from "react";

import { ApplyButton } from "~/components/apply";
import Footer from "~/components/footer";
import SynchronizedCarousel from "./_sections/hero";
import { Projects } from "./_sections/projects";
import { Spotlight } from "./_sections/spotlight";

export default function Page() {
  return (
    <main>
      <SynchronizedCarousel />
      <section className="relative flex w-full flex-col bg-[#F5F2F2] py-16 md:py-24">
        {/* Background graphics */}

        {/* Content */}
        <div className="relative z-10 px-6 md:px-16 lg:px-20">
          <h1 className="mb-8 text-3xl font-semibold leading-tight text-black md:mb-16 md:text-4xl lg:text-5xl">
            Welcome to ámaxa.
          </h1>

          <h2 className="mb-4 text-xl font-normal leading-tight text-[#3B3B3B] md:mb-10 md:text-2xl">
            THE PROBLEM
          </h2>

          <p className="mb-8 max-w-4xl text-2xl font-normal leading-tight text-black md:mb-10 md:text-3xl lg:text-4xl">
            It's too hard for people who want to make a difference to actually
            do it.
          </p>

          <h2 className="mb-4 text-xl font-normal leading-tight text-[#3B3B3B] md:mb-10 md:text-2xl">
            WHY DOES IT MATTER?
          </h2>

          <p className="max-w-4xl text-2xl font-normal leading-tight text-black md:text-3xl lg:text-4xl">
            People facing poverty, conflict, health challenges, and more could
            be
            <span className="font-bold"> profoundly impacted </span>
            if more of us knew how to turn our passion into meaningful change.
          </p>
        </div>
      </section>

      <section className="lg:px-30 relative bg-white py-16 md:py-24">
        <div className="px-6 md:px-16 lg:px-20">
          {/* Main heading */}
          <h1 className="mb-12 text-3xl font-semibold leading-tight text-black md:mb-16 md:text-4xl lg:text-5xl">
            The Ámaxa Cohort Program takes you from start to finish of what's
            needed to truly effect change.
          </h1>

          {/* Description text */}
          <div className="mb-12 max-w-5xl text-xl font-normal leading-relaxed text-[#3B3B3B] md:mb-16 md:text-2xl">
            <p className="mb-10">
              Through our 3-month 100% remote program, you meet weekly with a
              team from across the globe, guided by an ámaxa coach, to effect
              measurable change through one of our 10 partner nonprofits or
              initiatives.
            </p>
            <p>
              The program is open to{" "}
              <span className="font-semibold">
                high school students, college students, and professionals.
              </span>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row md:gap-10">
            {/* High school button */}
            <React.Suspense fallback={<div>Loading...</div>}>
              <ApplyButton variant="color">
                I'm a high school student →
              </ApplyButton>

              {/* College button */}
              <ApplyButton variant="black">
                I'm in college or beyond →
              </ApplyButton>
            </React.Suspense>
          </div>
        </div>
      </section>
      <section className="relative w-full p-16 md:p-24">
        <Projects />
      </section>

      <section className="flex flex-col items-start justify-center bg-[#F5F2F2] px-6 py-16 md:px-16 md:py-24 lg:px-20">
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
      </section>
      {[
        {
          heading: "Member Spotlight",
          name: "How An Nhi Sequestered Carbon by Planting Trees",
          ageLocation: "16, Vietnam",
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
          teammates: "Teammates: Mohamed (17, Turkey) & Lauryn (16, USA)",
          videoUrl:
            "https://player.vimeo.com/video/1069899673?h=0ef231b81a&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
        },
        {
          heading: "TEAM SPOTLIGHT",
          name: "How Isabella and Zobia's Love for Music Changed Lives in Gaza",
          ageLocation: "16 & 17, USA",
          paragraphs: [
            '"Change, in any capacity, can and should start with us." -Isabella',
            `
Through ámaxa’s student impact fellowship, and a partnership with the nonprofit Gaza Champions, Isabella, Zobia, and their program coach Delilah created Alliance Academy’s first “Melody of Alliance Fall Charity Concert”. After being told that the brainstormed event could happen in just two weeks, the team jumped into action. They had spent the few weeks prior getting an idea of their timeline based on their before-winter-break goal and now they’d met a crunch point where all tasks were vital to make the concert the best it could be. Isabella and Zobia worked together in and outside of the weekly meetings arranged by their coach to contact sponsors for the event’s raffle, create awesome marketing material, and make sure everything was approved by school authority. At the event, they had 20 attendants, 3 raffle prizes awarded, and almost $200 USD raised. The team reflected that they believe that they did an awesome job with the limited job they were given. A huge takeaway was to focus on what you are in control of.
`,
          ],
          teammates: "",
          videoUrl:
            "https://player.vimeo.com/video/1069887902?h=acd24c8d11&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
        },
        {
          heading: "TEAM SPOTLIGHT",
          name: "Meet Panshul, Jad, and Yueqi.",
          ageLocation: "UAE, LEBANON, & CHINA",
          paragraphs: [
            `“Since almost all students in Palestine have access to the Web, we aim to create an interactive, educational website where students can find pre-recorded lessons by tutors who will be recruited by our team.” Driven by their combined passions for education and technology, Zhao (16, China), Jad (16, Lebanon), Noor (16, Qatar), and Panshul (14, UAE), led by coach Sibel, created Accessifyed, which now offers 16 math lessons and 10 English lessons with tutoring`,
            `Panshul, Jad, and Zhao are now Ámaxa Student Ambassadors. The ámaxa leadership team will provide 1-1 coaching and guidance to expand Accessifyed from an MVP to a scaled solution for all of ISNAD’s students.`,
            `“My team members proved to be some of the most ambitious people with a strong wish to make a change. They approached the project wholeheartedly and wanted to put in the work to make something that would stay an important part of online, accessible education.” -Sibel, Team Coach`,
          ],
          teammates: "",
          videoUrl: "",
        },
      ].map((spotlight, idx) => (
        <Spotlight key={idx} spotlightData={spotlight} />
      ))}

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
