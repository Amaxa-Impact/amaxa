/**
 * FocusCards - Interactive card grid with hover effects
 *
 * When you hover over a card, other cards blur and scale down slightly.
 * Cards link to their destination when clicked.
 *
 * Props:
 * - cards: Array of { title, src (image URL), link, description? }
 * - columns: Number of columns (default: 3 for md+, 1 for mobile)
 */

import { memo, useState } from "react";

import { cn } from "@amaxa/ui";

interface CardData {
  title: string;
  src: string;
  link: string;
  description?: string;
}

interface CardProps {
  card: CardData;
  index: number;
  hovered: number | null;
  setHovered: (index: number | null) => void;
  showDescription?: boolean;
}

const Card = memo(function Card({
  card,
  index,
  hovered,
  setHovered,
  showDescription = false,
}: CardProps) {
  return (
    <a href={card.link}>
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        className={cn(
          "relative h-60 w-full overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 ease-out md:h-96 dark:bg-neutral-900",
          hovered !== null && hovered !== index && "scale-[0.98] blur-sm",
        )}
      >
        {/* Card image */}
        <img
          src={card.src}
          alt={card.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Overlay with title (shown on hover) */}
        <div
          className={cn(
            "absolute inset-0 flex items-end bg-black/50 px-4 py-8 transition-opacity duration-300",
            showDescription
              ? "opacity-100"
              : hovered === index
                ? "opacity-100"
                : "opacity-0",
          )}
        >
          <div
            className={cn(
              "bg-gradient-to-b from-neutral-50 to-neutral-200 bg-clip-text text-xl font-medium text-transparent transition-all duration-300 md:text-2xl",
              showDescription && hovered === index && "bg-none text-black",
            )}
          >
            {card.title}
            {showDescription && card.description && (
              <p className="text-xl font-light">{card.description}</p>
            )}
          </div>
        </div>
      </div>
    </a>
  );
});

interface FocusCardsProps {
  cards: CardData[];
  /** Number of columns on md+ screens. Default: 3. Set to 4 for pathways grid. */
  columns?: 3 | 4;
  /** Show description text below title */
  showDescription?: boolean;
}

export function FocusCards({
  cards,
  columns = 3,
  showDescription = false,
}: FocusCardsProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const gridClass =
    columns === 4 ? "grid-cols-1 md:grid-cols-4" : "grid-cols-1 md:grid-cols-3";

  return (
    <div className={cn("grid w-full max-w-6xl gap-10 py-5", gridClass)}>
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
          showDescription={showDescription}
        />
      ))}
    </div>
  );
}
