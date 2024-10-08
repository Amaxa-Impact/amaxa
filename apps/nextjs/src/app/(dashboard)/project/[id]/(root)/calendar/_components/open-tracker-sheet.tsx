"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@amaxa/ui/button";

import { useTrackerParams } from "./hooks";

export function OpenTrackerSheet() {
  const { setParams } = useTrackerParams();

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setParams({ create: true })}
      >
        <PlusIcon />
      </Button>
    </div>
  );
}
