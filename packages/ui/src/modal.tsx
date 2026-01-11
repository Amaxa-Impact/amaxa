"use client";

import type * as React from "react";
import { useRouter } from "next/navigation";
import { IconX } from "@tabler/icons-react";

import { cn } from ".";
import { Button } from "./button";

interface ModalProps {
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export function Modal({
  children,
  className,
  showCloseButton = true,
}: ModalProps) {
  const router = useRouter();

  return (
    <>
      <div
        className="fade-in-0 animate-in fixed inset-0 isolate z-50 bg-black/80 duration-100 supports-backdrop-filter:backdrop-blur-xs"
        data-slot="modal-overlay"
        onClick={() => router.back()}
      />
      <div
        className={cn(
          "fade-in-0 zoom-in-95 animate-in bg-background ring-foreground/10 fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl p-4 text-xs/relaxed ring-1 duration-100 outline-none",
          className,
        )}
        data-slot="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        {showCloseButton && (
          <Button
            className="absolute top-2 right-2"
            onClick={() => router.back()}
            size="icon-sm"
            variant="ghost"
          >
            <IconX />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </div>
    </>
  );
}
