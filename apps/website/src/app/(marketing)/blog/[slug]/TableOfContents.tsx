"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export const TableOfContents = ({ headings }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      // Find which heading is currently at the top of the viewport
      const headingElements = headings.map((h) => ({
        id: h.id,
        element: document.getElementById(h.id),
      }));

      // Check each heading from top to bottom
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const { element } = headingElements[i]!;
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            // 100px offset from top
            setActiveId(headingElements[i]!.id);
            return;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-24 hidden lg:block">
      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-neutral-900">
          Table of Contents
        </h3>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id}>
              <button
                onClick={() => handleClick(heading.id)}
                className={`text-left text-sm transition-colors hover:text-neutral-900 ${
                  activeId === heading.id
                    ? "font-semibold text-neutral-900"
                    : "text-neutral-600"
                }`}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
