"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CheckIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

type CourseData = {
  value: number;
  label: string;
};

export function PickerForm(props: { data: CourseData[], idx: string }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data, idx } = props;
  const [value, setValue] = React.useState(searchParams.get(idx) ?? "");

  function handleChange(value: string) {
    if (value == "" || value == " " || value == null || value === "clear") {
      return router.push(pathname);
    }
    setValue(value);
    router.push(`${pathname}/?${idx}=${value}`);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? data.find((framework) => framework.value === parseInt(value))?.label
            : `Select a ${props.idx}`}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search ..." className="h-9" />
          <CommandEmpty>No Course found.</CommandEmpty>
          <CommandGroup>
            {data.map((framework) => (
              <CommandItem
                key={framework.value}
                value={String(framework.value)}
                onSelect={(currentValue) => {
                  handleChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                {framework.label ?? "Clear"}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    parseInt(value) === framework.value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
