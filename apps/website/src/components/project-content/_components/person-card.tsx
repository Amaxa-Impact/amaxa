"use client";

import { cn } from "@amaxa/ui";

interface PersonCardProps {
  name: string;
  image: string;
  role: string;
}

export function PersonCard({ name, image, role }: PersonCardProps) {
  return (
    <div className="group/card w-full max-w-xs">
      <div
        style={{ backgroundImage: `url(${image})` }}
        className={cn(
          " card backgroundImage relative mx-auto flex h-96 max-w-sm  cursor-pointer flex-col justify-between overflow-hidden rounded-md p-4 shadow-xl",
          "bg-cover",
        )}
      >
        <div className="absolute left-0 top-0 h-full w-full opacity-60 transition duration-300 group-hover/card:bg-black"></div>
        <div className="text content">
          <h1 className="relative z-10 text-xl font-bold text-gray-50 md:text-2xl">
            {name}
          </h1>
          <p className="relative z-10 my-4 text-sm font-normal text-gray-50">
            {role}
          </p>
        </div>
      </div>
    </div>
  );
}
