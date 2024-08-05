import WhatMakesUsDiffrent from "./_components/different";
import Hero from "./_components/hero";
import HowItWorks from "./_components/how-it-works";
import { Projects } from "./_components/project";
import { Testimonials } from "./_components/testimonials";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <HowItWorks />
      <div className="overflow-x-hidden pt-3">
        <div className="absolute bottom-0 ml-[-50%] mt-[100px] h-[20px] w-[200%] rounded-t-[100%] bg-white"></div>
      </div>
      <Projects />
      <WhatMakesUsDiffrent />
      <Testimonials />
    </div>
  );
}
