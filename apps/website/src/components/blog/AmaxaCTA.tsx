"use client";
import React from 'react';
import Link from 'next/link';

interface AmaxaCTAProps {
  text?: string;
  link?: string;
  variant?: 'start-solving' | 'blog' | 'explore' | 'apply';
}

export function AmaxaCTA({ 
  text = "Learn more about ámaxa and start solving problems with global nonprofits!",
  link = "/start-solving",
  variant = "start-solving"
}: AmaxaCTAProps) {
  const getVariantText = () => {
    switch (variant) {
      case 'start-solving':
        return "Join our Student Impact Program and start solving problems with global non-profits!";
      case 'blog':
        return "Check out our blog to find amazing local and remote opportunities!";
      case 'explore':
        return "Explore all the problems you can help solve on ámaxa!";
      case 'apply':
        return "Apply today to get started with ámaxa!";
      default:
        return text;
    }
  };

  const getVariantLink = () => {
    switch (variant) {
      case 'start-solving':
        return "/start-solving";
      case 'blog':
        return "/blog";
      case 'explore':
        return "/explore-problems-all";
      case 'apply':
        return "/start-solving";
      default:
        return link;
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Ready to Make an Impact?
        </h3>
        <p className="text-blue-700 mb-4">
          {getVariantText()}
        </p>
        <Link 
          href={getVariantLink()}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Get Started with ámaxa
        </Link>
      </div>
    </div>
  );
} 