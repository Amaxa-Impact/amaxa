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
      const headingElements = headings.map((h) => ({
        id: h.id,
        element: document.getElementById(h.id),
      }));

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const headingElement = headingElements[i];
        if (headingElement?.element) {
          const rect = headingElement.element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveId(headingElement.id);
            return;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

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
      <div className="border-border bg-card rounded-lg border p-4">
        <h3 className="text-foreground mb-3 text-sm font-semibold">
          Table of Contents
        </h3>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id}>
              <button
                onClick={() => handleClick(heading.id)}
                className={`hover:text-foreground text-left text-sm transition-colors ${
                  activeId === heading.id
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
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
