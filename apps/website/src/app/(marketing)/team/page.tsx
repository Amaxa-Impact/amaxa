import React from "react";

import { PersonCard } from "./_components/author-card";

const members = [
  {
    name: "Lauren McMillen",
    title: "Founder & CEO",
    image: "/lauren-headshot.png",
    role: "Founder & CEO",
  },
  {
    name: "Lexi Jones",
    title: "Head of Programs and Marketing",
    image: "/lex-headshot.jpg",
    role: "Head of Programs and Marketing ",
  },
  {
    name: "Hasibur",
    title: "Director of Student Experience ",
    image: "/hasibur-headshot.png",
    role: "Director of Student Experience ",
  },
  {
    name: "Pari Singh",
    title: "Director of Operations",
    image: "/pari-headshot.png",
    role: "Director of Operations",
  },
  {
    name: "Heather Miller",
    title: "Director of Digital Marketing",
    image: "/heather-headshot.png",
    role: "Director of Digital Marketing",
  },
  {
    name: "Phoebe Cox",
    title: "Head of Research and Strategy",
    image: "/phoebe-headshot.png",
    role: "Head of Research and Strategy",
  },
];

export default function Page() {
  return (
    <div>
      <h1 className="text-5xl font-bold">Meet The Team!</h1>
      <div className="relative z-10 grid grid-cols-3 gap-10 py-10 ">
        {members.map((member, index) => (
          <PersonCard key={index} {...member} />
        ))}
      </div>
    </div>
  );
}
