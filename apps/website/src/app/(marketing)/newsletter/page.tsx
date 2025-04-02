
"use client"
import React from "react";
import { ApplyButton } from "~/components/apply";
import { useEffect } from "react";
import Link from "next/link";


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
                Our newsletter rocks. {" "}
                <span className="text-2xl text-[#3B3B3B]">
                  (we promise.)

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

      
     

<section className="w-full py-12 md:py-16 lg:py-20 px-6 md:px-16 lg:px-20">
<div className="max-w-7xl mx-auto space-y-16 md:space-y-20">
  {/* High School Program */}
  <div className="space-y-8 md:space-y-10">
    <div className="flex flex-col md:flex-row md:items-center md:gap-12">
      {/* Left: Description */}
      <div className="w-full md:w-1/2 space-y-6">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-[#3B3B3B]">
      Ámaxa Monthly Newsletter
    </h2>
        <p className="text-lg md:text-xl lg:text-2xl font-normal text-[#3B3B3B] leading-relaxed">
          The ámaxa monthly newsletter is your go-to for staying up to date on all things ámaxa. Content ranges from project and cohort updates, to student written columns and executive insights written by the leadership team. Bottom line: the newsletter is designed to give you a personal look at what is going on in ámaxa-world each month.
        </p>

        <div>
            <Link 
        href="https://amaxaimpact.substack.com/subscribe?utm_source=email&utm_campaign=email-subscribe&r=1qhobc&next=https%3A%2F%2Famaxaimpact.substack.com%2Fp%2Fmarch-preview&utm_medium=email"   
       >
        Subscribe Now → 
        </Link>
        </div>
      </div>

      {/* Right: Substack Embed */}
      <div className="w-full md:w-1/2 mt-8 md:mt-0">
        <div className="substack-post-embed bg-white p-6 rounded-xl shadow-md">
          <p className="text-xl font-semibold">March Preview... by Ámaxa</p>
          <p className="text-gray-700 mt-2">
            popcorn, new funding team, ambassadors in action
          </p>
          <a
            href="https://amaxaimpact.substack.com/p/march-preview"
            className="inline-block mt-4 text-blue-600 underline hover:text-blue-800"
            data-post-link
          >
            Read on Substack
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
<div className="max-w-7xl mx-auto space-y-16 md:space-y-20">
  {/* High School Program */}
  <div className="space-y-8 md:space-y-10">
    <div className="flex flex-col md:flex-row md:items-center md:gap-12">
      {/* Left: Description */}
      <div className="w-full md:w-1/2 space-y-6">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-[#3B3B3B]">
      Culture & Cause
      </h2>
        <p className="text-lg md:text-xl lg:text-2xl font-normal text-[#3B3B3B] leading-relaxed">
        Culture & Cause is ámaxa’s second newsletter written by Isabella Benice and Alexi Jones, members of ámaxa’s marketing and communications team. This newsletter was born out of our recognition that the pop culture and media we consume seeps into our consciousness and impacts how we see the world, even if we don’t always realize it. Pop culture has always been used to catalyze change, and since changemaking is what ámaxa is all about, it only makes sense that we pay attention to it. Each of these newsletters is sectioned off in the same way and lands in your inbox on the 15th of each month. 
        </p>

        <p className="text-lg md:text-xl lg:text-2xl font-normal text-[#3B3B3B] leading-relaxed">
        We hope it makes you think, smile, and if nothing else, gives you some interesting things to listen to and read over your upcoming weeks. Enjoy!
        </p>

        <p className="text-sm md:text-sm lg:text-sm font-normal text-[#3B3B3B] leading-relaxed font-light">
        P.S. Anyone can submit questions, essays, poems etc to Culture & Cause, so if you consider yourself a creative, shoot an email to lexi@amaxaimpact.org with a pitch/draft/piece!
        </p>



        <div>
        <Link 
        href="https://amaxaimpact.substack.com/subscribe?utm_source=email&utm_campaign=email-subscribe&r=1qhobc&next=https%3A%2F%2Famaxaimpact.substack.com%2Fp%2Fmarch-preview&utm_medium=email"   
       >
        Subscribe Now → 
        </Link>
        </div>
      </div>

      {/* Right: Substack Embed */}
      <div className="w-full md:w-1/2 mt-8 md:mt-0">
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
      </div>
    </div>
  </div>
</div>


      </section>

    </main>
  );
}
