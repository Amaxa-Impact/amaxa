"use client";

import React from "react";
import { SearchIcon } from "lucide-react";
import { useQueryState } from "nuqs";

import { Button } from "@amaxa/ui/button";
import { CommandDialog, CommandInput } from "@amaxa/ui/command";
import { Input } from "@amaxa/ui/input";

export default function SearchBar() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = useQueryState("globalSearch");

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  return (
    <div>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Button
          variant="outline"
          className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
          onClick={() => setOpen(true)}
        >
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
          />
        </Button>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type to search..."
          value={search ?? ""}
          onValueChange={setSearch}
        />
      </CommandDialog>
    </div>
  );
}
