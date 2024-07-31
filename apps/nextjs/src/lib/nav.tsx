import { BookIcon, Calendar, HomeIcon } from "lucide-react";

import type { SidebarLink } from "~/app/(home)/_components/sidebar-items";

interface AdditionalLinks {
  title: string;
  links: SidebarLink[];
}

export function getLink() {
  const defaultLinks: SidebarLink[] = [
    { href: "/", title: "Home", icon: HomeIcon },
    {
      href: "/events",
      title: "Events",
      icon: Calendar,
    },
    {
      href: "/action-guides",
      title: "Action Guides",
      icon: BookIcon,
    },
  ];
  return defaultLinks;
}
export const additionalLinks: AdditionalLinks[] = [];
