import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MenuIcon, MountainIcon } from "lucide-react";

import { Button } from "@amaxa/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@amaxa/ui/sheet";

import NavigationSection from "./nav";

export const Header = () => {
  return (
    <div className="flex flex-row items-start justify-evenly md:items-center">
      <Image
        src="/amaxa.png"
        alt="logo"
        width={100}
        height={100}
        className="hidden md:block"
      />

      <MobileNav />
      <NavigationSection />
      <div className="hidden gap-4 md:flex  md:flex-row">
        <Link href={"/apply"} passHref>
          <button
            className="rounded-xl border border-primary bg-primary px-4 py-2 text-sm text-white transition duration-200 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
            disabled
          >
            Apply now
          </button>
        </Link>
      </div>
    </div>
  );
};

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="block md:hidden">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">amaxa</span>
        </Link>
        <div className="grid gap-2 py-6">
          <Link
            href="/#projects"
            className="flex w-full items-center py-2 text-lg font-semibold"
            prefetch={false}
          >
            Explore Our Projects
          </Link>
          <Link
            href="/team"
            className="flex w-full items-center py-2 text-lg font-semibold"
            prefetch={false}
          >
            Meet the Team
          </Link>
          <Link
            href="stories"
            className="flex w-full items-center py-2 text-lg font-semibold"
            prefetch={false}
          >
            Read Stories
          </Link>
          <Link
            href="/support-us"
            className="flex w-full items-center py-2 text-lg font-semibold"
            prefetch={false}
          >
            Support Us
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};
