"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link from next/link

import { cn } from "@amaxa/ui";

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: any;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <Link href={card.link} passHref>
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        className={cn(
          "relative h-60 w-full overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 ease-out md:h-96 dark:bg-neutral-900",
          hovered !== null && hovered !== index && "scale-[0.98] blur-sm",
        )}
      >
        <Image
          src={card.src}
          alt={card.title}
          fill
          className="absolute inset-0 object-cover"
        />

        <div className="absolute inset-0 flex items-end bg-black/50 px-4 py-8 transition-all duration-300">
          <div
            className={cn(
              "md:text-md bg-gradient-to-b from-neutral-50 to-neutral-200 bg-clip-text text-xl font-medium text-transparent transition-all duration-300",
              hovered === index && "bg-none text-black", // or whatever hover effect you want
            )}
          >
            <p className="text-xl font-light"> {card.title}</p>
          </div>
        </div>
      </div>
    </Link>
  ),
);

Card.displayName = "Card";

interface Card {
  title: string;
  description: string;
  src: string;
  link: string;
}

export function FocusCards({ cards }: { cards: Card[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid w-full max-w-6xl grid-cols-1 gap-1 py-5 md:grid-cols-8">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}
