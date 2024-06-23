"use client";

import React from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

export function Testimonials() {
  return (
    <div className="pb-22 relative flex flex-col justify-center pt-10">
      <h3 className="mb-8 text-5xl font-bold">What members say</h3>
      <InfiniteMovingCards items={items} direction="right" speed="normal" />
    </div>
  );
}

const items = [
  {
    quote:
      "In the beginning of this project, I thought it was impossible. As time progressed, I realized we could definitely create this change and no matter how big anything may seem, with the right people and the right support, we can.",
    name: "Katelyn, 16",
    title: "from the US",
  },
  {
    quote:
      "In the beginning of this project, I thought it was impossible. As time progressed, I realized we could definitely create this change and no matter how big anything may seem, with the right people and the right support, we can.",
    name: "Katelyn, 16",
    title: "from the US",
  },
  {
    quote:
      "In the beginning of this project, I thought it was impossible. As time progressed, I realized we could definitely create this change and no matter how big anything may seem, with the right people and the right support, we can.",
    name: "Katelyn, 16",
    title: "from the US",
  },
];
