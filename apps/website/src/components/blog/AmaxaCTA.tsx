"use client";

import React from "react";
import Link from "next/link";

interface AmaxaCTAProps {
  text?: string;
  link?: string;
  variant?: "start-solving" | "blog" | "explore" | "apply";
}

export function AmaxaCTA({
  text = "Learn more about ámaxa and start solving problems with global nonprofits!",
  link = "/start-solving",
  variant = "start-solving",
}: AmaxaCTAProps) {
  const getVariantText = () => {
    switch (variant) {
      case "start-solving":
        return "Join our Student Impact Program and start solving problems with global non-profits!";
      case "blog":
        return "Check out our blog to find amazing local and remote opportunities!";
      case "explore":
        return "Explore all the problems you can help solve on ámaxa!";
      case "apply":
        return "Apply today to get started with ámaxa!";
      default:
        return text;
    }
  };

  const getVariantLink = () => {
    switch (variant) {
      case "start-solving":
        return "/start-solving";
      case "blog":
        return "/blog";
      case "explore":
        return "/explore-problems-all";
      case "apply":
        return "/start-solving";
      default:
        return link;
    }
  };

  return (
    <div className="my-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
      <div className="text-center">
        <h3 className="mb-2 text-lg font-semibold text-blue-900">
          Ready to Make an Impact?
        </h3>
        <p className="mb-4 text-blue-700">{getVariantText()}</p>
        <Link
          href={getVariantLink()}
          className="inline-block rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
        >
          Get Started with ámaxa
        </Link>
      </div>
    </div>
  );
}
