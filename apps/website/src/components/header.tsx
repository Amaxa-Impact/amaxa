"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { cn } from "@amaxa/ui";
import { buttonVariants } from "@amaxa/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@amaxa/ui/navigation-menu";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@amaxa/ui/sheet";

import { ApplyButton } from "./apply";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const cls = cn("text-2xl", navigationMenuTriggerStyle());

  const navItems = [
    { href: "/project", label: "Discover Projects" },
    { href: "/pathways", label: "Explore Our Pathways" },
    { href: "/project-stories", label: "Read Ámaxa Stories" },
    { href: "/who-we-are", label: "Meet Our Team" },
    { href: "/contact-us", label: "Contact Us" },
    { href: "/newsletter", label: "Subscribe to Our Newsletter" },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <header className="w-max-screen relative hidden h-[89px] flex-row items-center justify-between px-10 md:flex lg:px-8">
        <div>
          <Link href="/" className="text-3xl font-bold">
            ámaxa
          </Link>
        </div>

        <NavigationMenu>
          <NavigationMenuList className="text-xl">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink className={cls}>
                    {item.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex flex-row gap-[24px]">
          <ApplyButton variant="color">Apply Now</ApplyButton>
          {/* <Link
            href="https://app.amaxaimpact.org"
            target="_blank"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
              }),
              "rounded-[3rem]",
            )}
          >
            Login
          </Link> */}
        </div>
      </header>

      {/* Mobile Navbar */}
      <header className="flex h-[70px] items-center justify-between px-6 md:hidden">
        <Link href="/" className="text-2xl font-bold">
          ámaxa
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="p-2">
              <Menu size={24} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] sm:w-[350px]">
            <div className="mt-8 flex flex-col gap-6">
              {navItems.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xl font-medium transition-colors hover:text-primary"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
              <div className="mt-4 flex flex-col gap-4">
                <SheetClose asChild>
                  <ApplyButton variant="color">Apply Now</ApplyButton>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="https://app.amaxaimpact.org"
                    target="_blank"
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                        size: "lg",
                      }),
                      "w-full rounded-[3rem]",
                    )}
                  >
                    Login
                  </Link>
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
};
