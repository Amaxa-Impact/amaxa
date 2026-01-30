"use client";

import { useEffect, useRef, useState } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

import { Button } from "@amaxa/ui/button";

interface PitchCarouselProps {
  children: React.ReactNode;
  totalSlides: number;
}

export function PitchCarousel({ children, totalSlides }: PitchCarouselProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScrollToSlide = (slideIndex: number) => {
    const isValidIndex = slideIndex >= 0 && slideIndex < totalSlides;
    if (!isValidIndex) return;

    setCurrentSlideIndex(slideIndex);

    const container = scrollContainerRef.current;
    if (container) {
      const slideWidth = container.offsetWidth;
      const scrollPosition = slideWidth * slideIndex;
      container.scrollTo({ left: scrollPosition, behavior: "smooth" });
    }
  };

  const handleNextSlide = () => handleScrollToSlide(currentSlideIndex + 1);
  const handlePrevSlide = () => handleScrollToSlide(currentSlideIndex - 1);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleManualScroll = () => {
      const slideWidth = container.offsetWidth;
      const scrollPosition = container.scrollLeft;
      const visibleSlideIndex = Math.round(scrollPosition / slideWidth);

      const isNewSlide = visibleSlideIndex !== currentSlideIndex;
      const isValidIndex =
        visibleSlideIndex >= 0 && visibleSlideIndex < totalSlides;

      if (isNewSlide && isValidIndex) {
        setCurrentSlideIndex(visibleSlideIndex);
      }
    };

    container.addEventListener("scroll", handleManualScroll);
    return () => container.removeEventListener("scroll", handleManualScroll);
  }, [currentSlideIndex, totalSlides]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") handleNextSlide();
      if (event.key === "ArrowLeft") handlePrevSlide();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  });

  const isFirstSlide = currentSlideIndex === 0;
  const isLastSlide = currentSlideIndex === totalSlides - 1;
  const currentSlideNumber = String(currentSlideIndex + 1).padStart(2, "0");
  const totalSlidesNumber = String(totalSlides).padStart(2, "0");

  return (
    <div className="bg-background relative h-screen w-screen overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="scrollbar-hidden flex h-full w-full snap-x snap-mandatory overflow-x-auto"
      >
        {children}
      </div>

      <nav className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevSlide}
          disabled={isFirstSlide}
          className="border-border bg-card/80 h-12 w-12 rounded-full backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <IconChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2 px-4">
          {Array.from({ length: totalSlides }).map((_, index) => {
            const isActive = index === currentSlideIndex;
            return (
              <button
                key={index}
                onClick={() => handleScrollToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 rounded-full transition-all ${
                  isActive
                    ? "bg-brand-green w-8"
                    : "bg-muted-foreground/40 hover:bg-muted-foreground/60 w-2"
                }`}
              />
            );
          })}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNextSlide}
          disabled={isLastSlide}
          className="border-border bg-card/80 h-12 w-12 rounded-full backdrop-blur-sm"
          aria-label="Next slide"
        >
          <IconChevronRight className="h-5 w-5" />
        </Button>
      </nav>

      <div className="text-muted-foreground fixed right-8 bottom-8 z-50 font-mono text-sm">
        {currentSlideNumber} / {totalSlidesNumber}
      </div>
    </div>
  );
}
