import { ArrowRight } from "lucide-react";

interface PathwayCardProps {
  title: string;
  description: string;
  imageSrc: string;
  href: string;
}

export function PathwayCard({
  title,
  description,
  imageSrc,
  href,
}: PathwayCardProps) {
  return (
    <a href={href} className="group block h-full">
      <article className="relative h-[360px] overflow-hidden rounded-2xl border border-neutral-300 transition-all duration-300 hover:border-[#BCD96C] hover:shadow-lg">
        {/* Background Image */}
        <img
          src={imageSrc}
          alt={title}
          loading="lazy"
          className="absolute inset-0 h-full w-full scale-100 object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Content */}
        <div className="relative flex h-full flex-col justify-end p-6">
          {/* Text block with fixed space */}
          <div className="pr-14">
            <h3 className="line-clamp-2 text-xl font-medium text-white [text-shadow:0_0_1px_rgba(0,0,0,0.85),0_2px_6px_rgba(0,0,0,0.45)] md:text-2xl">
              {title}
            </h3>

            <p className="mt-2 line-clamp-3 text-sm text-white/90 [text-shadow:0_0_1px_rgba(0,0,0,0.85),0_2px_6px_rgba(0,0,0,0.45)] md:text-base">
              {description}
            </p>
          </div>

          {/* Button pinned bottom-right */}
          <div className="absolute right-6 bottom-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/90 transition-all duration-300 group-hover:bg-[#BCD96C]">
            <ArrowRight className="h-4 w-4 text-[#3B3B3B] transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>
      </article>
    </a>
  );
}
interface PathwayGridProps {
  pathways: Array<{
    title: string;
    description: string;
    src: string;
    link: string;
  }>;
}

/**
 * PathwayGrid - Grid layout for pathway cards
 *
 * Responsive grid that shows:
 * - 1 column on mobile
 * - 2 columns on tablet
 * - 4 columns on desktop
 */
export function PathwayGrid({ pathways }: PathwayGridProps) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      {pathways.map((pathway) => (
        <PathwayCard
          key={pathway.link}
          title={pathway.title}
          description={pathway.description}
          imageSrc={pathway.src}
          href={pathway.link}
        />
      ))}
    </div>
  );
}
