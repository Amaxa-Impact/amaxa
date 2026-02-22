"use client";

import { memo, useMemo } from "react";
import Link from "next/link";

import { buttonVariants } from "@amaxa/ui/button";

import { useAuthContext } from "~/lib/auth/auth-context";
import { ProfileDropdown } from "./profile-dropdown";

interface NavLink {
  href: string;
  label: string;
  adminOnly?: boolean;
}

const baseLinks: NavLink[] = [{ href: "/", label: "Home" }];

const adminLinks: NavLink[] = [
  { href: "/workspaces", label: "Workspaces", adminOnly: true },
  { href: "/applications", label: "Applications", adminOnly: true },
];

export const TopNavbar = memo(function TopNavbar() {
  const { isAdmin } = useAuthContext();

  const links = useMemo(() => {
    if (isAdmin) {
      return [...baseLinks, ...adminLinks];
    }
    return baseLinks;
  }, [isAdmin]);

  return (
    <nav className="border-border bg-card h-14 border-b">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-lg font-semibold">
            Amaxa
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {links.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                className={buttonVariants({
                  variant: "ghost",
                })}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <ProfileDropdown />
        </div>
      </div>
    </nav>
  );
});
