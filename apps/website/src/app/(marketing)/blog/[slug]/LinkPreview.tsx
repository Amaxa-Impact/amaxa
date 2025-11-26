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
  "font-bold text-card-foreground underline decoration-muted-foreground decoration-2 underline-offset-2 transition-all hover:text-foreground hover:decoration-foreground";

export const LinkPreview = ({
  href,
  children,
  isExternal,
}: LinkPreviewProps) => {
  const [previewData, setPreviewData] = useState<{
    title?: string;
    description?: string;
    image?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isExternal || !href.startsWith("http")) return;

    const fetchPreview = async () => {
      setLoading(true);
      try {
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
        console.error("Error fetching link preview:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchPreview();
  }, [href, isExternal]);

  if (!isExternal || !href.startsWith("http")) {
    return (
      <a href={href} className={linkClassName}>
        {children}
      </a>
    );
  }

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
      <HoverCardContent>
        {loading ? (
          <>
            <span className="block h-40 w-full animate-pulse rounded-t bg-muted" />
            <span className="block space-y-2 p-4">
              <span className="block h-4 w-3/4 animate-pulse rounded bg-muted" />
              <span className="block h-3 w-full animate-pulse rounded bg-muted" />
            </span>
          </>
        ) : (
          <>
            {previewData?.image && (
              <span className="relative block h-40 w-full bg-muted">
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
              </span>
            )}
            <span className="block space-y-2 p-4">
              {previewData?.title && (
                <span className="line-clamp-2 block text-sm font-semibold text-foreground">
                  {previewData.title}
                </span>
              )}
              {previewData?.description && (
                <span className="line-clamp-2 block text-xs text-muted-foreground">
                  {previewData.description}
                </span>
              )}
              <span className="block break-all text-xs text-muted-foreground/60">
                {href}
              </span>
            </span>
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};
