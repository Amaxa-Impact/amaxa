"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@amaxa/ui";

export function NavMain({
  className,
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
} & React.ComponentProps<"ul">) {
  return (
    <ul className={cn("grid gap-0.5", className)}>
      {items.map((item) => (
        <li
          key={item.title}
          className="group relative rounded-md hover:bg-accent hover:text-accent-foreground has-[[data-state=open]]:bg-accent has-[[data-state=open]]:text-accent-foreground"
        >
          <Link
            href={item.url}
            className="flex h-7 items-center gap-2.5 overflow-hidden rounded-md px-1.5 text-xs outline-none ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2"
          >
            <item.icon className="h-4 w-4 shrink-0 translate-x-0.5 text-muted-foreground" />
            <div className="line-clamp-1 grow overflow-hidden pr-6 font-medium">
              {item.title}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
