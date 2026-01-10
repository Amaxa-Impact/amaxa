"use client";

import { Layout, MapIcon, PieChart, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { Id } from "@/convex/_generated/dataModel";
import { useDashboardContext } from "../context";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamDisplay } from "./team-switcher";

export function AppSidebar({
  projectId,
  ...props
}: React.ComponentProps<typeof Sidebar> & { projectId: Id<"projects"> }) {
  const { userRole } = useDashboardContext();
  const isCoach = userRole === "coach";

  const links = [
    {
      name: "Home",
      url: `/project/${projectId}`,
      icon: Layout,
    },
    {
      name: "Tasks",
      url: `/project/${projectId}/tasks`,
      icon: PieChart,
    },
    {
      name: "Users",
      url: `/project/${projectId}/users`,
      icon: MapIcon,
    },
    ...(isCoach
      ? [
          {
            name: "Settings",
            url: `/project/${projectId}/settings`,
            icon: Settings,
          },
        ]
      : []),
  ];
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamDisplay />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={links} />
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-2 text-muted-foreground text-xs">
          Role:{" "}
          <span className="font-medium capitalize">{userRole || "None"}</span>
        </div>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
