"use client";

import React from "react";

import { AboutSection } from "./_components/about-section";
import { cards, testimonials } from "./_components/data";
import { HeroSection } from "./_components/hero-section";
import { MissionImageSection } from "./_components/mission-image-section";
import { PathwaysCards } from "./_components/pathways-cards";
import { PathwaysIntro } from "./_components/pathways-intro";
import { StudentImpactDetails } from "./_components/student-impact-details";
import { StudentImpactIntro } from "./_components/student-impact-intro";
import { StudentImpactIntro2 } from "./_components/student-impact-intro-2";
import { TestimonialsIntro } from "./_components/testimonials-intro";
import { TestimonialsIntro2 } from "./_components/testimonials-intro-2";
import { TestimonialsSection } from "./_components/testimonials-section";
import { TestimonialsSection2 } from "./_components/testimonials-section-2";
import { TitleSection } from "./_components/title-section";
import { VisionCTASection } from "./_components/vision-cta-section";
import { VisionCTASection2 } from "./_components/vision-cta-section-2";
import { VisionDetailSection } from "./_components/vision-detail-section";

export { cards, testimonials };

export default function WhoAreWePage() {
  return (
    <main className="w-full">
      <TitleSection />
      <HeroSection />
      <AboutSection />
      <PathwaysIntro />
      <PathwaysCards />
      <TestimonialsIntro />
      <TestimonialsSection />
      <StudentImpactIntro />
      <StudentImpactDetails />
      <VisionCTASection />
      <MissionImageSection />
      <VisionDetailSection />
      <TestimonialsIntro2 />
      <TestimonialsSection2 />
      <StudentImpactIntro2 />
      <VisionCTASection2 />
    </main>
  );
}
