/**
 * Custom Animation Components
 *
 * These are React components that use Framer Motion for animations.
 * Use with Astro's client:load or client:visible directives.
 *
 * Example in Astro:
 * ---
 * import { FocusCards } from '@/components/custom-animations';
 * ---
 * <FocusCards client:load cards={cards} />
 */

export { FocusCards } from "./focus-cards";
export { Carousel, Card as AppleCard, CarouselContext } from "./apple-cards";
export { WobbleCard } from "./wobble-card";
export { AnimatedTestimonials } from "./animated-testimonials";
export { ColourfulText } from "./colourful-text";
export { Timeline } from "./timeline";
export { AnimatedTitle } from "./animated-title";
