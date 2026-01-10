"use client";

import type React from "react";

interface BlogQuoteProps {
  children: React.ReactNode;
  author?: string;
  className?: string;
}

export function BlogQuote({
  children,
  author,
  className = "",
}: BlogQuoteProps) {
  return (
    <blockquote
      className={`my-8 border-l-4 border-blue-500 bg-blue-50 p-6 text-lg text-gray-800 italic ${className}`}
    >
      <div className="text-gray-700">{children}</div>
      {author && (
        <cite className="mt-4 block text-sm font-medium text-gray-600 not-italic">
          — {author}
        </cite>
      )}
    </blockquote>
  );
}
