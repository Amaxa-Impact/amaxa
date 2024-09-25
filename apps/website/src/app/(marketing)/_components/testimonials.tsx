"use client";

import React from "react";

import { SkewedInfiniteScroll } from "~/components/skew-infintie-scroll";

export function Testimonials() {
  return (
    <div className="pb-22 flex flex-col justify-center pt-10">
      <h3 className="mb-8 text-5xl font-bold">What members say</h3>
      <SkewedInfiniteScroll items={testimonials} />
    </div>
  );
}
const testimonials = [
  {
    quote:
      "There are so many options, and they actually seem like I can make an impact in someone else's life.",
    name: "Melina",
  },
  {
    quote: "We have leisure time and its a disservice to not help others.",
    name: "Isabella",
  },
  {
    quote:
      "I was really proud of that moments. I was super surprised I could raise donation - Sekou was like thank you so much, i was like youre welcome, i was just doin gmy job",
    name: "Simmer (coach)",
  },
  {
    quote: "I love being out and helping communities out. That's why I applied",
    name: "Simmer (coach)",
  },
  {
    quote:
      "After ámaxa, I will already know how to better communicate within a team, how to organize a project from scratch, and above all, how to overcome obstacles that arise.",
    name: "Otilia, 17",
  },
  {
    quote:
      "One of my newsletter articles was about how Liberia has some of the worse education rates; children don't stay in system for too long. Learning about how the political and social conflict has affected the education system in particular, such as brain drain, and seeing the statistics on why students can't progress through primary and high school, was one of my favorite parts of the program.",
    name: "Lareb",
  },
  {
    quote:
      "It helps me with my confidence to make a difference. The things I'm learning here are real-world stuff for me to get to do. I interviewed for this scholarship and they were so impressed because all of this- planning the project, doing outreach, working remotely, time zones- is transferable.",
    name: "Julia W",
  },
  {
    quote:
      "It's not every day I come across a program that treats students like global leaders.",
    name: "Maitha",
  },
  {
    quote:
      "In the beginning of this project, I thought it was impossible. I was scared and unsure because I've never done something like this before. I felt this was such a big problem and didn't know I could tackle it. As time progressed, I realized that we could definitely tackle things, we could definitely create this change and no matter how big anything may seem, with the right people and the right support, we can.",
    name: "Katelyn, 16",
  },
  {
    quote:
      "Amaxa taught me that if I have an idea that helps other people, I can develop it.",
    name: "Mohamad, 18",
  },
  {
    quote:
      "I learned how to work better in a team and that I can make a change from very far away.",
    name: "Diya, 16",
  },
  {
    quote:
      "Our team focused on the issue of lack of education in Palestine. Our project focused on bringing people from around the world to create videos in English and math to educate children who can't go to school. By looking at views from the 4 founders (team members) from around the world, I learned to develop different perspectives and to value each and every person's opinion.",
    name: "Panshula, 13",
  },
  {
    quote:
      "I really like the sound of this. I really like how it's basically coneying that spreadin gawareness about mh is merely not enough in order for people to truly understand it and education is more important. Educating people about how to help someone and how to recognize different symptoms.In order to gain knowledge about mh, you need to recognize mental health probelms and understan underlying causes. It's great people spread awareness, mental health month, but also not everbody that spreads awareness undeerstand true underlying factors that goes with mental health isssues",
    name: "Tara",
  },
];
