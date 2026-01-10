import { memo } from "react";
import { Button } from "@/components/ui/button";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { useDashboardContext } from "../context";

export const TeamDisplay = memo(() => {
  const { project } = useDashboardContext();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Button
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          size="lg"
          variant="ghost"
        >
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{project.name}</span>
          </div>
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
  );
});

TeamDisplay.displayName = "TeamDisplay";
