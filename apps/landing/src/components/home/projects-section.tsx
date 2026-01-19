/**
 * ProjectsSection - Carousel of project cards on the homepage
 *
 * Shows a horizontal scrolling carousel of project cards.
 * Uses the AppleCards carousel component.
 */

import { Card, Carousel } from "@/components/custom-animations/apple-cards";
import { projectCards } from "@/lib/project-cards";

export function ProjectsSection() {
  // Create card elements from the project data
  const cards = projectCards.map((card, index) => (
    <Card key={card.id} card={card} index={index} />
  ));

  return (
    <div className="h-full w-full overflow-x-hidden bg-transparent">
      <h2 className="font-sans text-xl font-bold text-neutral-800 md:text-5xl dark:text-neutral-200">
        Our Projects
      </h2>
      <Carousel items={cards} />
    </div>
  );
}
