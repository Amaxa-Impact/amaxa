import React from "react";
import Image from "next/image";

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
      <div className="relative z-10 grid grid-cols-1  py-10 md:grid-cols-2 lg:grid-cols-4">
        {members.map((member, index) => (
          <ProjectCard key={index} {...member} />
        ))}
      </div>
    </div>
  );
}

interface MemberCardProps {
  name: string;
  image: string;
  role: string;
}

const ProjectCard = ({ name, role, image }: MemberCardProps) => {
  return (
    <div className="group relative flex min-h-[400px] flex-col py-10 dark:border-neutral-800 lg:border-b lg:border-l lg:border-r">
      <div className="group pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover:opacity-100 dark:from-neutral-800"></div>
      <div className="w-full">
        <Image
          src={image}
          fill={true}
          className="w-full"
          alt="Illustration 1"
        />
      </div>

      <span
        className="absolute bottom-0 left-0 p-4 font-bold text-white"
        style={{ textShadow: "0 4px 8px rgba(0, 0, 0, 0.7)" }}
      >
        {name} • {role}
      </span>
    </div>
  );
};
