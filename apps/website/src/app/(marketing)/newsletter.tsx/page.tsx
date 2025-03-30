"use client"
import React from "react";
import { ApplyButton } from "~/components/apply";
import { useEffect } from "react";





export default function ProgramPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://substack.com/embedjs/embed.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);
  }, []);
  
  return (
    <main>

<div className="relative w-full max-h-[320px] md:max-h-[320px] sm:max-h-[240px] bg-white flex flex-col px-6 md:px-12 lg:px-20">
        {/* Background container - hidden but preserved for reference */}
        <div className="absolute inset-0 invisible">
          <div className="w-full h-full" style={{ background: "url(/Untitled design.png)" }} />
        </div>
        {/* Content container with flex layout */}
        <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-16 lg:px-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="max-w-full md:max-w-3xl lg:max-w-4xl mb-12 md:mb-0">
              <h1 className="text-4xl md:text-4xl lg:text-6xl font-light leading-tight text-[#3B3B3B]">
               Stay in Touch: {" "}
                <span className="font-normal text-[#3B3B3B]">
                  Our Newsletter
                </span>
              </h1>

              {/* Green wavy line - SVG replacement for the image */}
              <div className="relative h-6 w-48 md:w-64 lg:w-200 ml-auto -mt-2 md:-mt-4">
                <svg
                  viewBox="0 0 325 500"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className=""
                >
                  <path
                    d="M1 41C1 41 54 10 81 41C108 72 162 10 189 41C216 72 270 41 270 41"
                    stroke="#BCD96C"
                    strokeWidth="8"
                  />
                  strokeLinecap="round"
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>

      
      {/* <section className="w-full bg-white py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-16 lg:px-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="max-w-full md:max-w-3xl lg:max-w-4xl mb-12 md:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-light leading-tight text-[#3B3B3B]">
                Effect change from anywhere with{" "}
                <span className="font-normal text-[#3B3B3B]">
                  Ámaxa Cohorts
                </span>
              </h1>

              <div className="relative h-6 w-48 md:w-64 lg:w-80 ml-auto -mt-2 md:-mt-4">
                <svg
                  viewBox="0 0 325 82"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <path
                    d="M1 41C1 41 54 10 81 41C108 72 162 10 189 41C216 72 270 41 270 41"
                    stroke="#BCD96C"
                    strokeWidth="8"
                  />
                  strokeLinecap="round"
                </svg>
              </div>
            </div>

            <div className="mt-8 md:mt-16 lg:mt-24 self-end md:self-center">
              <React.Suspense fallback={<div>Loading...</div>}>

                <ApplyButton
                  variant="ghost"
                >
                  Apply now
                </ApplyButton>
              </React.Suspense>
            </div>
          </div>
        </div>
      </section> */}
    

      <section className="w-full py-12 md:py-16 lg:py-20 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto space-y-16 md:space-y-20">
          {/* High School Program */}
          <div className="space-y-8 md:space-y-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-[#3B3B3B]">
            Ámaxa Monthly Newsletter

            </h2>

            <p className="text-lg md:text-xl lg:text-2xl font-normal text-[#3B3B3B] leading-relaxed">
            The ámaxa monthly newsletter is your go-to for staying up to date on all things ámaxa. Content ranges from project and cohort updates, to student written columns and executive insights written by the leadership team. Bottom line: the newsletter is designed to give you a personal look at what is going on in ámaxa-world each month.

            </p>

            <div className="substack-post-embed bg-white p-6 rounded-xl shadow-md">
      <p className="text-xl font-semibold">join the burnt out club!!❤️‍🔥 by Ámaxa</p>
      <p className="text-gray-700 mt-2">
        plus Valentino, Navy SEALS, grad school, and Mickey 17
      </p>
      <a
        href="https://amaxaimpact.substack.com/p/join-the-burnt-out-club"
        className="inline-block mt-4 text-blue-600 underline hover:text-blue-800"
        data-post-link
      >
        Read on Substack
      </a>
    </div>

       
{/* 
            <div>
              <React.Suspense fallback={<div>Loading...</div>}>
                <ApplyButton
                  variant="color"
                >
                  Apply to Ámaxa High School →
                </ApplyButton>
              </React.Suspense>
            </div> */}
          </div>

          {/* College & Professionals Program */}
          <div className="space-y-8 md:space-y-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-[#3B3B3B]">
            Culture & Cause
            </h2>

            <p className="text-lg md:text-xl lg:text-2xl font-normal text-[#3B3B3B] leading-relaxed">
            Culture & Cause is ámaxa’s second newsletter written by Isabella Benice and Alexi Jones, members of ámaxa’s marketing and communications team. This newsletter was born out of our recognition that the pop culture and media we consume seeps into our consciousness and impacts how we see the world, even if we don’t always realize it. Pop culture has always been used to catalyze change, and since changemaking is what ámaxa is all about, it only makes sense that we pay attention to it. Each of these newsletters is sectioned off in the same way and lands in your inbox on the 15th of each month. 

            </p>

            <div>
              <React.Suspense fallback={<div>Loading...</div>}>
                <ApplyButton
                  variant="black"
                >
                  Apply to Ámaxa College & Professionals →
                </ApplyButton>
              </React.Suspense>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#F5F2F2] py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-[#3B3B3B] mb-12 md:mb-16">
            How Cohorts Work
          </h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-black"></div>

            {/* Timeline steps */}
            <div className="space-y-16 md:space-y-20">
              {/* Step 1 */}
              <div className="relative pl-16 md:pl-20">
                {/* Circle */}
                <div className="absolute left-0 top-3 w-8 h-8 rounded-full bg-[#F4FFD6] border border-black flex items-center justify-center">
                  <span className="sr-only">Step 1</span>
                </div>

                <h3 className="text-xl md:text-2xl lg:text-3xl font-normal text-black mb-4">
                  Apply to the next cohort.
                </h3>

                <p className="text-lg md:text-xl lg:text-2xl font-normal text-[#3B3B3B] leading-relaxed">
                  We offer cohorts for high school students, college students,
                  and professionals.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative pl-16 md:pl-20">
                {/* Circle */}
                <div className="absolute left-0 top-3 w-8 h-8 rounded-full bg-[#C8D998] border border-black flex items-center justify-center">
                  <span className="sr-only">Step 2</span>
                </div>

                <h3 className="text-xl md:text-2xl lg:text-3xl font-normal text-black mb-4">
                  Attend an interview.
                </h3>

                <p className="text-lg md:text-xl lg:text-2xl font-normal text-[#3B3B3B] leading-relaxed">
                  Tell us more about your interests, time availability, and
                  projects or initiatives you're most interested in.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative pl-16 md:pl-20">
                {/* Circle */}
                <div className="absolute left-0 top-3 w-8 h-8 rounded-full bg-[#BCD96C] border border-black flex items-center justify-center">
                  <span className="sr-only">Step 3</span>
                </div>

                <h3 className="text-xl md:text-2xl lg:text-3xl font-normal text-black mb-4">
                  We match you to a project, team, and coach!
                </h3>

                <p className="text-lg md:text-xl lg:text-2xl font-normal text-[#3B3B3B] leading-relaxed">
                  We aim to match you to a project you are passionate about with
                  a team that meets in a time that you indicated works for you
                  consistently.
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative pl-16 md:pl-20">
                {/* Circle */}
                <div className="absolute left-0 top-3 w-8 h-8 rounded-full bg-[#94AB55] border border-black flex items-center justify-center">
                  <span className="sr-only">Step 4</span>
                </div>

                <h3 className="text-xl md:text-2xl lg:text-3xl font-normal text-black mb-4">
                  Meet remotely with your team{" "}
                  <span className="font-semibold">weekly</span> for{" "}
                  <span className="font-semibold">3 months</span>.
                </h3>

                <p className="text-lg md:text-xl lg:text-2xl font-normal text-[#3B3B3B] leading-relaxed">
                  Meetings last about one hour each week. Your coach will guide
                  you in the project management methodologies designed
                  specifically for our cohorts. Each meeting, coaches will lead
                  you in planning, brainstorming, status checks, problem
                  solving, and more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full bg-[#F5F2F2] py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-20">
          <div className="max-w-4xl lg:max-w-5xl mb-12 md:mb-16 lg:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal text-[#3B3B3B] leading-tight">
              Read stories of past members to learn about the diverse types of
              projects cohorts undertake.
            </h2>
          </div>

          <div>
            <a
              href="/project"
              className="inline-flex items-center justify-center px-7 py-3 bg-white border border-[#3B3B3B] rounded-full text-base md:text-lg text-[#3B3B3B] hover:bg-gray-50 transition-colors"
            >
              Read project stories →
            </a>
          </div>
        </div>
      </section>
      <section className="w-full py-16 md:py-24 lg:py-32 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-black mb-6">
            What makes us different?
          </h2>

          <p className="text-lg md:text-xl mb-16 max-w-4xl">
            We take you from "I wish I could" to "Here's how I did." To
            accomplish this, we spent the last two years iterating, improving,
            and learning. Here's some things we do different than everyone else:
          </p>

          <div className="space-y-16 md:space-y-24">
            {/* Feature 1 */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-[#BCD96C]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-normal text-[#3B3B3B] mb-4">
                  We built an online platform designed to amplify the impact of
                  our teams.
                </h3>
                <p className="text-lg mb-6 max-w-3xl">
                  With each new cohort, we more precisely understand teams'
                  challenges, and over time, this data will fuel AI-driven
                  tools, giving each team lessons of all teams before them.
                </p>
                <a
                  href="/platform"
                  className="inline-flex items-center justify-center px-6 py-2 bg-[#BCD96C] rounded-full text-[#3B3B3B] hover:bg-[#a9c55a] transition-colors"
                >
                  Learn more about our platform →
                </a>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-[#BCD96C]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-normal text-[#3B3B3B] mb-4">
                  We are accessible across income and location.
                </h3>
                <p className="text-lg mb-6 max-w-3xl">
                  The ability to effect change should not be limited by your
                  home or your income. That's why we strive to make our
                  community accessible and inclusive, so everyone who wants to
                  make an impact can join. Our cohorts are 100% remote, and we
                  offer scholarships to anyone who is unable to pay our annual
                  $150 membership fee. After we receive funding, we aim to
                  remove the fee altogether.
                </p>
                <a
                  href="/mission"
                  className="inline-flex items-center justify-center px-6 py-2 bg-[#BCD96C] rounded-full text-[#3B3B3B] hover:bg-[#a9c55a] transition-colors"
                >
                  Read more about our mission →
                </a>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-[#BCD96C]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-normal text-[#3B3B3B] mb-4">
                  We are more than a 'program'. We are a community.
                </h3>
                <p className="text-lg mb-6 max-w-3xl">
                  Members leave a cohort with friends around the world. Whether
                  becoming close to your team members and coach, or meeting
                  others through our remote events, ámaxa aims to forge
                  connections that last well beyond the 3 month project.
                </p>
                <a
                  href="/stories"
                  className="inline-flex items-center justify-center px-6 py-2 bg-[#BCD96C] rounded-full text-[#3B3B3B] hover:bg-[#a9c55a] transition-colors"
                >
                  Read stories of our members →
                </a>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-[#BCD96C]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-normal text-[#3B3B3B] mb-4">
                  Our projects and initiatives are high-impact.
                </h3>
                <p className="text-lg mb-6 max-w-3xl">
                  Our projects are high-impact, innovative, and
                  community-driven. We have partnered with nonprofits in
                  Palestine, Liberia, and Uganda whose community-founded
                  solutions are innovative in their fields, such as ISNAD
                  Community Center's approach to community-based learning, the
                  first in its area, and the Nyaka School's holistic approach to
                  supporting AIDS-affected communities.
                </p>
                <p className="text-lg mb-6 max-w-3xl">
                  Where we spotted gaps in high-impact projects that our members
                  wanted to work on, we created our own. Led by Head of Programs
                  Alexi Jones, we have launched three new initiatives in 2024,
                  focusing on mental health, feminism, and LBGTQ+
                  representation.
                </p>
                <a
                  href="/projects"
                  className="inline-flex items-center justify-center px-6 py-2 bg-[#BCD96C] rounded-full text-[#3B3B3B] hover:bg-[#a9c55a] transition-colors"
                >
                  Explore All Projects →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
