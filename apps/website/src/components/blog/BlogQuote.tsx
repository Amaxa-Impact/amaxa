import React from 'react';

interface BlogQuoteProps {
  children: React.ReactNode;
  author?: string;
  className?: string;
}

export default function BlogQuote({ children, author, className = "" }: BlogQuoteProps) {
  return (
    <blockquote className={`border-l-4 border-blue-500 bg-blue-50 p-6 my-8 italic text-lg text-gray-800 ${className}`}>
      <div className="text-gray-700">
        {children}
      </div>
      {author && (
        <cite className="block mt-4 text-sm font-medium text-gray-600 not-italic">
          — {author}
        </cite>
      )}
    </blockquote>
  );
} 