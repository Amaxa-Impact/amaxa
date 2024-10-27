"use client";

import {
  Calendar,
  GitGraphIcon,
  Home,
  InfoIcon,
  LifeBuoy,
  Map,
  MapIcon,
  PieChart,
  Send,
  UserIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
} from "@amaxa/ui/sidebar";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

// you cannot pass server components inside client components, you must pass them as props
export function AppSidebar({
  teamSwitcher,
  id,
}: {
  teamSwitcher: React.ReactNode;
  id: string;
}) {
  const session = useSession();
  const user = {
    id: session.data?.user.id!,
    name: session.data?.user.name!,
    email: session.data?.user.email!,
    avatar: session.data?.user.image!,
  };
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
    projects: [
      {
        name: "Overview",
        url: `/project/${id}/`,
        icon: PieChart,
      },
      {
        name: "Flowchart",
        url: `/project/${id}/tasks`,
        icon: GitGraphIcon,
      },
      {
        name: "Calendar",
        url: `/project/${id}/calendar`,
        icon: Calendar,
      },
      {
        name: "Tasks",
        url: `/project/${id}/table`,
        icon: Map,
      },
      {
        name: "Permissions",
        url: `/project/${id}/permissions`,
        icon: UserIcon,
      },
    ],
  };

  return (
    <Sidebar>
      <SidebarHeader>{teamSwitcher}</SidebarHeader>
      <SidebarContent>
        <SidebarItem>
          <SidebarLabel>Platform</SidebarLabel>
          <NavMain
            items={[
              {
                title: "Home",
                url: "/",
                icon: Home,
              },
              {
                title: "Guides",
                url: "/guides/action-guides",
                icon: InfoIcon,
              },
              {
                title: "Event",
                url: "/events",
                icon: MapIcon,
              },
            ]}
          />
        </SidebarItem>
        <SidebarItem>
          <SidebarLabel>Projects</SidebarLabel>
          <NavProjects projects={data.projects} />
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
