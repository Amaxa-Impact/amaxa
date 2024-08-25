"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { cn } from "@amaxa/ui";

//TODO: memoize
export function GuidesTabs() {
  const pathname = usePathname();
  return (
    <nav className="mt-6 hidden w-fit items-center space-x-2 rounded-full border border-border bg-background p-2 md:flex">
      <CategoryLink
        title="Action Guides"
        href="/guides/action-guides"
        active={pathname === "/guides/action-guides"}
      />

      <CategoryLink
        title="Fundraising"
        href="/guides/funds"
        active={pathname === "/guides/funds"}
      />
    </nav>
  );
}

const CategoryLink = ({
  title,
  href,
  active,
  mobile,
  setOpenPopover,
}: {
  title: string;
  href: string;
  active?: boolean;
  mobile?: boolean;
  setOpenPopover?: (open: boolean) => void;
}) => {
  if (mobile) {
    return (
      <Link
        href={href}
        {...(setOpenPopover && {
          onClick: () => setOpenPopover(false),
        })}
        className="flex w-full items-center justify-between rounded-md p-2 transition-colors hover:bg-muted active:bg-muted/80"
      >
        <p className="text-sm text-muted-foreground">{title}</p>
        {active && <Check size={16} className="text-muted-foreground" />}
      </Link>
    );
  }
  return (
    <Link href={href} className="relative z-10">
      <div
        className={cn(
          "rounded-full px-4 py-2 text-sm transition-all",
          active
            ? "text-primary-foreground"
            : "text-muted-foreground hover:bg-muted active:bg-muted/80",
        )}
      >
        {title}
      </div>
      {active && (
        <motion.div
          layoutId="indicator"
          className="absolute left-0 top-0 h-full w-full rounded-full bg-gradient-to-tr from-primary via-primary/80 to-primary"
          style={{ zIndex: -1 }}
        />
      )}
    </Link>
  );
};
