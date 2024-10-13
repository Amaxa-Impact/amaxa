"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "framer-motion";

import { cn } from "@amaxa/ui";

interface TabLink {
  href: string;
  label: string;
}

interface VercelTabsProps {
  links?: TabLink[];
  className?: string;
}

export function AppNav({ links, className }: VercelTabsProps) {
  const pathname = usePathname();

  if (!links || links.length === 0) {
    return null;
  }

  return (
    <TabsPrimitive.Root
      value={pathname}
      className={cn(
        `relative flex w-full items-center overflow-x-auto px-8`,
        className,
      )}
    >
      <TabsPrimitive.List className="flex">
        {links.map((link) => (
          <TabsPrimitive.Trigger
            key={link.href}
            value={link.href}
            asChild
            className="relative"
          >
            <Link
              href={link.href}
              className={cn(
                "inline-flex h-10 items-center justify-center px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                pathname === link.href
                  ? "text-gray-900 dark:bg-gray-700 dark:text-white"
                  : "text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-200",
              )}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeTab"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </Link>
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  );
}
