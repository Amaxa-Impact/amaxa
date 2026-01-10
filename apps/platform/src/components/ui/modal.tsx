"use client";

import { IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
        className="fade-in-0 fixed inset-0 isolate z-50 animate-in bg-black/80 duration-100 supports-backdrop-filter:backdrop-blur-xs"
        data-slot="modal-overlay"
        onClick={() => router.back()}
      />
      <div
        className={cn(
          "fade-in-0 zoom-in-95 fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 animate-in gap-4 rounded-xl bg-background p-4 text-xs/relaxed outline-none ring-1 ring-foreground/10 duration-100",
          className
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
