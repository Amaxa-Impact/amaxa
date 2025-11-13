"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@amaxa/ui/hover-card";

interface LinkPreviewProps {
  href: string;
  children: React.ReactNode;
  isExternal?: boolean;
}

const linkClassName =
  "font-bold text-neutral-700 underline decoration-neutral-400 decoration-2 underline-offset-2 transition-all hover:text-neutral-900 hover:decoration-neutral-600";

/**
 * LinkPreview Component
 *
 * Renders links in blog posts with hover previews for external URLs.
 * - Internal links: Simple anchor tag
 * - External links: Anchor tag wrapped in HoverCard that fetches preview data via Microlink API
 */
export const LinkPreview = ({
  href,
  children,
  isExternal,
}: LinkPreviewProps) => {
  // Store preview metadata (title, description, image) fetched from Microlink API
  const [previewData, setPreviewData] = useState<{
    title?: string;
    description?: string;
    image?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch preview data for external links using Microlink API
  useEffect(() => {
    if (!isExternal || !href.startsWith("http")) return;

    const fetchPreview = async () => {
      setLoading(true);
      try {
        // Microlink API handles all the hard work - fetching and parsing
        const response = await fetch(
          `https://api.microlink.io/?url=${encodeURIComponent(href)}`,
        );
        const data = await response.json();

        if (data.status === "success") {
          setPreviewData({
            title: data.data.title,
            description: data.data.description,
            image: data.data.image?.url,
          });
        }
      } catch (error) {
        // If fetch fails, just continue without preview data
      } finally {
        setLoading(false);
      }
    };

    void fetchPreview();
  }, [href, isExternal]);

  // For internal links (our own site), just show a regular link
  if (!isExternal || !href.startsWith("http")) {
    return (
      <a href={href} className={linkClassName}>
        {children}
      </a>
    );
  }

  // For external links, show hover card with preview
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          {children}
        </a>
      </HoverCardTrigger>
      {/* @ts-expect-error - Type definition issue with HoverCardContent children */}
      <HoverCardContent className="w-80 overflow-hidden border-neutral-200 bg-white p-0">
        {loading ? (
          // Show skeleton loader while fetching preview data
          <div className="space-y-2 p-4">
            <div className="h-40 w-full animate-pulse rounded-t bg-neutral-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
            <div className="h-3 w-full animate-pulse rounded bg-neutral-200" />
          </div>
        ) : (
          // Show preview data if available, otherwise just show URL
          <div className="overflow-hidden">
            {/* Preview image */}
            {previewData?.image && (
              <div className="relative h-40 w-full bg-neutral-100">
                <Image
                  src={previewData.image}
                  alt={previewData.title || "Preview"}
                  fill
                  className="object-cover"
                  unoptimized
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
            {/* Preview content */}
            <div className="space-y-2 p-4">
              {previewData?.title && (
                <h4 className="line-clamp-2 text-sm font-semibold text-neutral-900">
                  {previewData.title}
                </h4>
              )}
              {previewData?.description && (
                <p className="line-clamp-2 text-xs text-neutral-600">
                  {previewData.description}
                </p>
              )}
              <p className="break-all text-xs text-neutral-400">{href}</p>
            </div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};
