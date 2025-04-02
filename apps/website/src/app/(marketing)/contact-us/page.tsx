
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
               Contact Us {" "}
             
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
      Questions, comments, or partnership proposals? We've love to hear from you.
    </h2>
        <p className="text-lg md:text-xl lg:text-2xl font-normal text-[#3B3B3B] leading-relaxed">
          For general inquiries, please email our CEO Lauren McMillen at lauren@amaxaimpact.org.
        </p>

        <p className="text-lg md:text-xl lg:text-2xl font-normal text-[#3B3B3B] leading-relaxed">
          For collaboration inquiries, please email our COO Alexi Jones at lexi@amaxaimpact.org.
        </p>

        {/* <div>
          <React.Suspense fallback={<div>Loading...</div>}>
            <ApplyButton variant="color">
            Check out This Month's Edition →
            </ApplyButton>
          </React.Suspense>
        </div> */}
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

      </section>

    </main>
  );
}
