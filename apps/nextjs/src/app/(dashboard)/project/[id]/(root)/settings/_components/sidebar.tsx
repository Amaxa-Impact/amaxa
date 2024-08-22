"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavItem } from "./types";

interface SidebarProps {
  navItems: NavItem[];
}

export default function Sidebar({ navItems }: SidebarProps): JSX.Element {
  const pathname = usePathname();

  return (
    <nav className="grid gap-4 text-sm text-muted-foreground">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`font-semibold transition-colors hover:text-foreground ${
            pathname === item.href ? "text-primary" : ""
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
