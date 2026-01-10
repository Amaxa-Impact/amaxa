"use client";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export const NavProjects = memo(
  ({
    projects,
  }: {
    projects: { name: string; url: string; icon: LucideIcon }[];
  }) => {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <SidebarMenu>
          {projects.map((item) => (
            <SidebarMenuItem key={item.name}>
              <Link className="flex items-center gap-2" href={item.url}>
                <SidebarMenuButton>
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
  }
);
