/**
 * AppleCards - Horizontal scrolling carousel with card animations
 *
 * A carousel of cards that can be scrolled horizontally.
 * Cards animate in with a staggered fade effect.
 *
 * Usage:
 * <Carousel items={[<Card card={...} index={0} />, ...]} />
 */

import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MoveLeft, MoveRight } from "lucide-react";

import { cn } from "@amaxa/ui";

// Types
interface CardData {
  src: string;
  title: string;
  link: string;
  category: string;
  content?: React.ReactNode;
}

interface CarouselProps {
  items: React.JSX.Element[];
  initialScroll?: number;
}

// Context for card close handling (used when cards expand)
export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

/**
 * Carousel - The scrollable container for cards
 */
export function Carousel({ items, initialScroll = 0 }: CarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Check if we can scroll in either direction
  const checkScrollability = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  }, []);

  // Set initial scroll position
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll, checkScrollability]);

  // Scroll handlers
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Called when a card is closed (if cards can expand)
  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = window.innerWidth < 768 ? 230 : 384;
      const gap = window.innerWidth < 768 ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        {/* Scrollable container */}
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 [scrollbar-width:none] md:py-20"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          {/* Cards container */}
          <div
            className={cn(
              "flex flex-row justify-start gap-4 pl-4",
              "mx-auto max-w-7xl",
            )}
          >
            {items.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: "easeOut",
                  },
                }}
                key={"card" + index}
                className="rounded-3xl last:pr-[5%] md:last:pr-[33%]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="mr-10 flex justify-end gap-2">
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <MoveLeft className="h-6 w-6 text-gray-500" />
          </button>
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <MoveRight className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
}

/**
 * Card - Individual card in the carousel
 */
export function Card({
  card,
  index,
  layout = false,
}: {
  card: CardData;
  index: number;
  layout?: boolean;
}) {
  const handleClick = () => {
    window.location.href = card.link;
  };

  return (
    <motion.button
      layoutId={layout ? `card-${card.title}` : undefined}
      onClick={handleClick}
      className="relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-gray-100 md:h-[40rem] md:w-96 dark:bg-neutral-900"
    >
      {/* Gradient overlay at top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent" />

      {/* Card content */}
      <div className="relative z-40 p-8">
        <motion.p
          layoutId={layout ? `category-${card.category}` : undefined}
          className="text-left font-sans text-sm font-medium text-white md:text-base"
        >
          {card.category}
        </motion.p>
        <motion.p
          layoutId={layout ? `title-${card.title}` : undefined}
          className="mt-2 max-w-xs text-left font-sans text-xl font-semibold [text-wrap:balance] text-white md:text-3xl"
        >
          {card.title}
        </motion.p>
      </div>

      {/* Background image */}
      <BlurImage
        src={card.src}
        alt={card.title}
        className="absolute inset-0 z-10 h-full w-full object-cover"
      />
    </motion.button>
  );
}

/**
 * BlurImage - Image that blurs while loading
 */
function BlurImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [isLoading, setLoading] = useState(true);

  return (
    <img
      className={cn(
        "transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className,
      )}
      onLoad={() => setLoading(false)}
      src={src}
      loading="lazy"
      decoding="async"
      alt={alt}
    />
  );
}
