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
    name: "Lauren McMillen",
    title: "Founder & CEO",
    image: "/lauren-headshot.png",
    role: "Founder & CEO",
  },
  {
    name: "Lauren McMillen",
    title: "Founder & CEO",
    image: "/lauren-headshot.png",
    role: "Founder & CEO",
  },
];

export default function Page() {
  return (
    <div>
      <h1 className="text-5xl font-bold">Meet The Team!</h1>
      <div className="relative z-10 grid grid-cols-1  gap-2 py-10 ">
        {members.map((member, index) => (
          <PersonCard key={index} {...member} />
        ))}
      </div>
    </div>
  );
}
