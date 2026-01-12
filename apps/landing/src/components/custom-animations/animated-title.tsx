/**
 * Animated underline component - amaxa green wavy line
 *
 * Used to highlight important text with a decorative animated underline.
 */

import { cn } from "@amaxa/ui";

interface AnimatedUnderlineProps {
  color?: string;
  className?: string;
}

interface AnimatedTitleProps {
  className?: string;
  beforeText?: string;
  underlinedText: string;
  color?: string;
}

export function AnimatedUnderline({
  color = "#BCD96C",
  className = "",
}: AnimatedUnderlineProps) {
  return (
    <div
      className={cn(
        "absolute top-full left-0 h-20 overflow-visible",
        className,
      )}
      style={{ width: "100%" }}
    >
      <svg
        viewBox="0 0 325 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        preserveAspectRatio="none"
        style={{ overflow: "visible" }}
        aria-hidden="true"
      >
        <path
          d="M1 50C1 50 40 -5 80 50C120 105 160 -5 200 50C240 105 280 -5 325 20"
          stroke={color}
          strokeWidth="13"
          strokeLinecap="round"
          fill="none"
          className="animate-draw-line-permanent"
        />
      </svg>
    </div>
  );
}

export function AnimatedTitle({
  beforeText,
  underlinedText,
  color = "#BCD96C",
  className = "",
}: AnimatedTitleProps) {
  const fullText = beforeText
    ? `${beforeText} ${underlinedText}`
    : underlinedText;

  return (
    <h1
      className={cn(
        "mb-0 overflow-visible pb-3 text-center text-2xl leading-tight font-bold whitespace-nowrap text-black md:text-3xl lg:text-5xl",
        className,
      )}
    >
      <span className="relative inline-block overflow-visible font-bold">
        {fullText}
        <AnimatedUnderline color={color} />
      </span>
    </h1>
  );
}
