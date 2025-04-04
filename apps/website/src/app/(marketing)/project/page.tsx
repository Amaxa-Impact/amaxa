"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { BlurImage } from "~/components/ui/apple-cards";
// import { projects } from "./projects";
import { StickyScroll } from "~/components/ui/sticky-scroll-reveal";
import Image from "next/image";
import { FocusCards } from "@/components/ui/focus-cards";
import { projects } from "~/lib/constants/projects";
import { Projects } from "../_sections/projects";
import { ApplyButton } from "~/components/apply";


export default function Page() {
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
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-light leading-tight text-[#3B3B3B]">
               Explore{" "}
                <span className="font-normal text-[#3B3B3B]">
                  Our Projects 
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

      <section className="container mx-auto flex flex-col">
        <div className="text-[#3B3B3B] flex flex-col gap-10 py-10">
        <section className="w-full px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
      
       
          <div className="space-y-16 md:space-y-24">
         
              <div>
                <h3 className="text-2xl md:text-3xl font-normal text-[#3B3B3B] mb-4">
                Our projects are high-impact, innovative, and
                community-driven.
                 </h3>
                <p className="text-lg mb-6 max-w-3xl">
                  We have partnered with nonprofits in
                  Palestine, Liberia, and Uganda whose <strong>community-founded
                  solutions are innovative in their fields</strong>, and 
                  where we spotted gaps in high-impact projects that our members
                  wanted to work on, we launched original initiatives
                  focusing on <strong>mental health, feminism, and LBGTQ+
                  representation.</strong>
                </p>
                {/* <a
                  href="/projects"
                  className="inline-flex items-center justify-center px-6 py-2 bg-[#BCD96C] rounded-full text-[#3B3B3B] hover:bg-[#a9c55a] transition-colors"
                >
                  Explore All Projects →
                </a>  */}
                <p className="text-lg mb-6 max-w-3xl"> <strong>Hover or click</strong> below to discover each project.
</p>
                
                
              </div>
            </div>

            <FocusCards cards={projects} />



          </div>

          

          
     
      </section>

      
       </div>

      
      </section>   
      <section className="py-16 md:py-24 lg:py-32 bg-[#F5F2F2]">
        <div className="px-6 md:px-16 lg:px-20">
          {/* Main heading */}
          <h2 className="font-normal text-3xl md:text-4xl lg:text-5xl leading-tight text-[#3B3B3B] mb-12 md:mb-16 max-w-5xl">
            Join us to transform your passion into impact.
          </h2>

          {/* Button */}
          <ApplyButton variant="black">Apply Today</ApplyButton>
          {/* <button ="https://airtable.com/appPR9mkslbn3U8YZ/shrHHUtRzK4DqKt3F" className="box-border flex justify-center items-center py-3 px-6 bg-white border border-[#3B3B3B] rounded-full">
            <span className="font-normal text-base md:text-lg text-[#3B3B3B]" >
              Apply Today →
            </span>
          </button> */}
        </div>
      </section>

    
      {/* FOCUS CARDS */}
  






      


    </main>
  );
}
