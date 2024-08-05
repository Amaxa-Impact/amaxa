"use client";

import { Card, Carousel } from "~/components/ui/apple-cards";
import { Gaza } from "./project-content/Gaza";
import { Nyaka } from "./project-content/Nyaka";

const data = [
  {
    category: "Project",
    title: "Feeding Gaza: support for families in crisis",
    src: "",
    content: <Gaza />,
  },
  {
    category: "Project",
    title: "Nyaka Global, Giving light: solar solutions for Ugandan grandmas",
    src: "",
    content: <Nyaka />,
  },
  {
    category: "Project",
    title:
      " Educate Children, Unlocking potential: sponsoring Liberian students’ education",
    src: "",
    content: <Gaza />,
  },
];

export function Projects() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="h-full w-full py-20">
      <h2 className="font-sans text-xl font-bold text-neutral-800 dark:text-neutral-200 md:text-5xl">
        Our Projects
      </h2>
      <Carousel items={cards} />
    </div>
  );
}
