"use client";

import { Card, Carousel } from "~/components/ui/apple-cards";
import { projects } from "~/lib/constants/projects";

export function Projects() {
  const cards = projects.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="h-full w-full overflow-x-hidden bg-transparent">
      <h2 className="font-sans text-xl font-bold text-neutral-800 dark:text-neutral-200 md:text-5xl">
        Our Projects
      </h2>
      <Carousel items={cards} />
    </div>
  );
}
