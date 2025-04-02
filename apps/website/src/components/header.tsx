"use client";
import { cn } from "@amaxa/ui";
import { buttonVariants } from "@amaxa/ui/button";
import Link from "next/link";
import {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@amaxa/ui/navigation-menu";
import { ApplyButton } from "./apply";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@amaxa/ui/sheet";
import { useState } from "react";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const cls = cn("text-2xl", navigationMenuTriggerStyle());

  const navItems = [
    { href: "/project", label: "Explore Projects" },
    { href: "/program", label: "Our Cohorts" },
    { href: "/who-we-are", label: "Who We Are" },
    { href: "/newsletter", label: "Our Newsletter" },
    { href: "/contact-us", label: "Contact Us" },
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