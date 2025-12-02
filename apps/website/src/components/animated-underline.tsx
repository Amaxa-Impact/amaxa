"use client";

import React from "react";

interface AnimatedUnderlineProps {
  variant?: "professional" | "minimalist" | "hand-drawn-1" | "hand-drawn-2" | "hand-drawn-3";
  color?: string;
  className?: string;
}

/**
 * Animated underline component with different styles
 * Animates left to right and resets every 5 seconds
 */
export function AnimatedUnderline({
  variant = "professional",
  color = "#BCD96C",
  className = "",
}: AnimatedUnderlineProps) {
  const finalStrokeColor = color;

  // Original/professional style - amaxa green wavy line
  if (variant === "professional") {
    return (
      <div className={`absolute left-0 top-full h-8 overflow-visible ${className}`} style={{ width: "100%" }}>
        <svg
          viewBox="0 0 325 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          preserveAspectRatio="none"
          style={{ overflow: "visible" }}
        >
          <path
            d="M1 41C1 41 54 10 81 41C108 72 162 10 189 41C216 72 270 41 325 41"
            stroke={finalStrokeColor}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            className="animate-draw-line"
          />
        </svg>
      </div>
    );
  }

  // Minimalist style - Perfect C-shaped round stroke with smooth clean end
  if (variant === "minimalist") {
    return (
      <div className={`absolute left-0 top-full h-10 overflow-visible ${className}`} style={{ width: "100%" }}>
        <svg
          viewBox="0 0 325 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          preserveAspectRatio="none"
          style={{ overflow: "visible" }}
        >
          <path
            d="M1 25C1 25 15 18 40 12C65 6 100 4 140 6C180 8 220 4 260 6C285 7 305 10 320 14C323 16 324 18 325 20"
            stroke={finalStrokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="animate-draw-line"
          />
        </svg>
      </div>
    );
  }

  // Hand-drawn style 1 - Two complementary designs working together (Yellow)
  // For Explore Our Pathways page
  if (variant === "hand-drawn-1") {
    return (
      <div className={`absolute left-0 top-full h-14 overflow-visible ${className}`} style={{ width: "100%" }}>
        <svg
          viewBox="0 0 325 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          preserveAspectRatio="none"
          style={{ overflow: "visible" }}
        >
          {/* Top stroke - elegant wavy design */}
          <path
            d="M1 28C25 26 50 24 80 22C110 20 140 19 170 21C200 23 230 18 260 20C280 21 300 22 325 22"
            stroke={finalStrokeColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="animate-draw-line"
            style={{ animationDelay: "1s" }}
          />
          {/* Bottom stroke - complementary curved design with different pattern */}
          <path
            d="M5 55C30 53 60 50 90 48C120 46 150 45 180 47C210 49 240 44 270 46C290 47 310 48 325 48"
            stroke={finalStrokeColor}
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="animate-draw-line"
            style={{ animationDelay: "1s" }}
          />
        </svg>
      </div>
    );
  }

  // Hand-drawn style 2 - One smooth flowing stroke (Blue)
  // For Ámaxa Stories page
  if (variant === "hand-drawn-2") {
    return (
      <div className={`absolute left-0 top-full h-10 overflow-visible ${className}`} style={{ width: "100%" }}>
        <svg
          viewBox="0 0 325 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          preserveAspectRatio="none"
          style={{ overflow: "visible" }}
        >
          {/* One smooth flowing stroke - elegant continuous curve */}
          <path
            d="M1 35C30 33 60 31 90 29C120 27 150 25 170 23C185 21 195 19 200 17C205 15 208 13 210 11C212 9 213 7 212 5C211 3 209 4 207 6C205 8 202 11 198 14C194 17 188 20 180 22C172 24 160 26 145 28C130 30 110 32 85 33C60 34 30 35 1 35C1 35 30 33 60 31C90 29 120 27 150 25C170 23 185 21 200 19C215 17 230 15 245 17C260 19 275 21 290 23C300 24 310 25 325 25"
            stroke={finalStrokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="animate-draw-line"
            style={{ animationDelay: "1s" }}
          />
        </svg>
      </div>
    );
  }

  // Hand-drawn style 3 - circle first, then line passes through (Purple)
  // For Contact Us page
  if (variant === "hand-drawn-3") {
    return (
      <div className={`absolute left-0 top-full h-10 overflow-visible ${className}`} style={{ width: "100%" }}>
        <svg
          viewBox="0 0 325 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          preserveAspectRatio="none"
          style={{ overflow: "visible" }}
        >
          {/* Circle first - oval loop in middle */}
          <ellipse
            cx="162"
            cy="28"
            rx="15"
            ry="8"
            stroke={finalStrokeColor}
            strokeWidth="7"
            fill="none"
            className="animate-draw-line"
            style={{ animationDelay: "1s" }}
          />
          {/* Then line passes through - rounded line */}
          <path
            d="M1 40C30 38 60 36 90 34C110 32 125 29 140 26C150 24 155 22 160 28C165 34 170 30 175 28C180 26 195 24 210 26C225 28 245 30 265 32C285 34 305 35 318 35C322 35 324 35 325 35"
            stroke={finalStrokeColor}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="animate-draw-line"
            style={{ animationDelay: "2.8s" }}
          />
        </svg>
      </div>
    );
  }

  return null;
}

/**
 * Component for a single title with animated underline on specific part
 */
export function AnimatedTitle({
  beforeText,
  underlinedText,
  variant = "professional",
  color = "#BCD96C",
}: {
  beforeText?: string;
  underlinedText: string;
  variant?: "professional" | "minimalist" | "hand-drawn-1" | "hand-drawn-2" | "hand-drawn-3";
  color?: string;
}) {
  return (
    <h1 className="text-2xl font-semibold leading-tight text-black md:text-3xl lg:text-5xl overflow-visible pb-8 mb-0 whitespace-nowrap">
      {beforeText && <span className="font-normal">{beforeText} </span>}
      <span className="relative inline-block overflow-visible font-semibold">
        {underlinedText}
        <AnimatedUnderline variant={variant} color={color} />
      </span>
    </h1>
  );
}
