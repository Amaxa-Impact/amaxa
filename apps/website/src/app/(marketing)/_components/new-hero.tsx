import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@amaxa/ui";
import { Badge } from "@amaxa/ui/badge";
import { Button } from "@amaxa/ui/button";

import { ApplyButton } from "./apply-button";

export function Hero() {
  return (
    <div className="my-10 flex w-full flex-col justify-center gap-1 px-3 py-4 text-center md:my-20 md:p-6">
      <div>
        <Badge variant="outline" className="backdrop-blur-[2px]">
          <Link
            href="https://github.com/amaxa-impact/amaxa"
            target="_blank"
            rel="noreferrer"
            className="flex items-center"
          >
            Proudly Open Source
            <ChevronRight className="ml-1 h-3 w-3" />
          </Link>
        </Badge>
      </div>
      <div className="flex flex-col gap-6">
        <h1
          className={cn("text-4xl font-semibold text-foreground md:text-7xl")}
        >
          We help you effect
          <br />
          change in the world.
        </h1>
        <p className="mx-auto max-w-md text-lg text-muted-foreground md:max-w-xl md:text-xl">
          We connect high school students, college students, professionals, &
          retirees to high-impact projects with our 9 global partner nonprofits.
        </p>
      </div>
      <div className="my-4 flex flex-row justify-center gap-2">
        <div className="mt-8">
          <div className="flex items-center space-x-4">
            <Link href="">
              <Button
                variant="outline"
                className="h-12 border border-primary px-6"
              >
                Learn How
              </Button>
            </Link>

            <ApplyButton />
          </div>
        </div>
      </div>
    </div>
  );
}
