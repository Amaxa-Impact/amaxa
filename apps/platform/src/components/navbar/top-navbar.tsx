"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";

import { api } from "@amaxa/backend/_generated/api";
import { Button } from "@amaxa/ui/button";
import { Skeleton } from "@amaxa/ui/skeleton";

export const TopNavbar = memo(function TopNavbar() {
  const userStatus = useQuery(api.auth.getCurrentUserStatus);

  const links = useMemo(() => {
    const baseLinks = [{ href: "/", label: "Home" }];

    if (userStatus?.isAdmin) {
      baseLinks.push({ href: "/applications", label: "Applications" });
    }

    return baseLinks;
  }, [userStatus?.isAdmin]);

  if (userStatus === undefined) {
    return (
      <nav className="border-border bg-card h-14 border-b">
        <div className="flex h-full items-center gap-4 px-6">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-32" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-border bg-card h-14 border-b">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">Amaxa</span>
        </div>

        <div className="flex items-center gap-2">
          {links.map((link) => (
            <Button key={link.href} variant="ghost">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
});
