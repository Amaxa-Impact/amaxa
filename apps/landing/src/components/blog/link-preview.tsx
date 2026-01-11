import type * as React from "react";
import { useEffect, useRef, useState } from "react";
import { type } from "arktype";

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

const responseValidator = type({
  status: "'success' | 'error'",
  data: type({
    title: "string",
    "description?": "string",
    "image?": {
      "url?": "string.url",
    },
  }),
});
export const LinkPreview = ({
  href,
  children,
  isExternal,
}: LinkPreviewProps) => {
  const [previewData, setPreviewData] = useState<{
    title?: string;
    description?: string | undefined;
    image?: string | undefined;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasFetchedRef = useRef(false);

  const handleMouseEnter = () => {
    if (hasFetchedRef.current || !isExternal || !href.startsWith("http")) {
      return;
    }

    hasFetchedRef.current = true;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchPreview = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.microlink.io/?url=${encodeURIComponent(href)}`,
          { signal: controller.signal },
        );
        const res: unknown = await response.json();
        const data = responseValidator(res);

        if (data instanceof type.errors) {
          console.error("Error fetching link preview:", data);
          return;
        }

        if (data.status === "success") {
          setPreviewData({
            title: data.data.title,
            description: data.data.description,
            image: data.data.image.url,
          });
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error fetching link preview:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchPreview();
  };

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  if (!isExternal || !href.startsWith("http")) {
    return (
      <a href={href} className={linkClassName}>
        {children}
      </a>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
            onMouseEnter={handleMouseEnter}
          />
        }
      >
        {children}
      </HoverCardTrigger>
      <HoverCardContent>
        {loading ? (
          <>
            <span className="bg-muted block h-40 w-full animate-pulse rounded-t" />
            <span className="block space-y-2 p-4">
              <span className="bg-muted block h-4 w-3/4 animate-pulse rounded" />
              <span className="bg-muted block h-3 w-full animate-pulse rounded" />
            </span>
          </>
        ) : (
          <>
            {previewData?.image && (
              <span className="bg-muted relative block h-40 w-full">
                <img
                  src={previewData.image}
                  alt={previewData.title ?? "Preview"}
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </span>
            )}
            <span className="block space-y-2 p-4">
              {previewData?.title && (
                <span className="text-foreground line-clamp-2 block text-sm font-semibold">
                  {previewData.title}
                </span>
              )}
              {previewData?.description && (
                <span className="text-muted-foreground line-clamp-2 block text-xs">
                  {previewData.description}
                </span>
              )}
              <span className="text-muted-foreground/60 block text-xs break-all">
                {href}
              </span>
            </span>
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};
