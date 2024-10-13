"use client";

import { Cog } from "lucide-react";

import { Button } from "@amaxa/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@amaxa/ui/dropdown-menu";

interface Props {
  timeFormat: number;
  weekStartsOnMonday: boolean;
}

export function TrackerSettings({ timeFormat, weekStartsOnMonday }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Cog size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end" sideOffset={10}>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>Time Format</span>
            </DropdownMenuSubTrigger>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Start week on Monday</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal></DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
