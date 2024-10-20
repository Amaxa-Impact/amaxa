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
  user,
}: {
  teamSwitcher: React.ReactNode;
  id: string;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
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
  const searchResults = [
    {
      title: "Routing Fundamentals",
      teaser:
        "The skeleton of every application is routing. This page will introduce you to the fundamental concepts of routing for the web and how to handle routing in Next.js.",
      url: "#",
    },
    {
      title: "Layouts and Templates",
      teaser:
        "The special files layout.js and template.js allow you to create UI that is shared between routes. This page will guide you through how and when to use these special files.",
      url: "#",
    },
    {
      title: "Data Fetching, Caching, and Revalidating",
      teaser:
        "Data fetching is a core part of any application. This page goes through how you can fetch, cache, and revalidate data in React and Next.js.",
      url: "#",
    },
    {
      title: "Server and Client Composition Patterns",
      teaser:
        "When building React applications, you will need to consider what parts of your application should be rendered on the server or the client. ",
      url: "#",
    },
    {
      title: "Server Actions and Mutations",
      teaser:
        "Server Actions are asynchronous functions that are executed on the server. They can be used in Server and Client Components to handle form submissions and data mutations in Next.js applications.",
      url: "#",
    },
  ];

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
