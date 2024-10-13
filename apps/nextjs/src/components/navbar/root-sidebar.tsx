"use client";

import { usePathname } from "next/navigation";
import { Home, InfoIcon, LifeBuoy, MapIcon, Send } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
} from "@amaxa/ui/sidebar";

import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

// you cannot pass server components inside client components, you must pass them as props
export function RootSidebar({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const pathname = usePathname();
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },

    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarItem>
          <SidebarLabel>Platform</SidebarLabel>
          <NavMain
            items={[
              {
                title: "Home",
                url: "/",
                isActive: pathname === "/",
                icon: Home,
              },
              {
                title: "Guides",
                url: "/guides/action-guides",
                isActive: pathname.includes("guides"),
                icon: InfoIcon,
              },
              {
                title: "Event",
                url: "/events",
                isActive: pathname === "/events",
                icon: MapIcon,
              },
            ]}
          />
        </SidebarItem>
        <SidebarItem className="mt-auto">
          <SidebarLabel>Help</SidebarLabel>
          <NavSecondary items={data.navSecondary} />
        </SidebarItem>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
