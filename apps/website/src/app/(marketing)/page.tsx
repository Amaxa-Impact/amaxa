import WhatMakesUsDiffrent from "./_components/different";
import Hero from "./_components/hero";
import HowItWorks from "./_components/how-it-works";
import { Projects } from "./_components/project";
import { Testimonials } from "./_components/testimonials";

export default function Home() {
  return (
    <div className="flex flex-col pt-12 md:pt-32">
      <Hero />
      <HowItWorks />
      <Projects />
      <WhatMakesUsDiffrent />
      <Testimonials />
    </div>
  );
}
