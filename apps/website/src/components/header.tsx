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

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const cls = cn("text-2xl", navigationMenuTriggerStyle());

  const navItems = [
    // { href: "/who-we-are", label: "Meet Ámaxa" },
    { href: "/project", label: "Discover Projects" },
    { href: "/pathways", label: "Explore Our Pathways" },
    { href: "/project-stories", label: "Read Ámaxa Stories" },
    // { href: "/newsletter", label: "Keep in Touch" },
    { href: "/contact-us", label: "Contact Us" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <>
      {/*Scrum 6 Green Banner - Similar to Rise Website*/}
      <Link
        href="https://airtable.com/appPR9mkslbn3U8YZ/shrHHUtRzK4DqKt3F"
        className="block bg-[#abc468] px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-black"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-1">
          <span>Application to an Ámaxa Pathway.</span>
          <span className="font-semibold underline">Apply here now!</span>
        </div>
      </Link>
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
                <NavigationMenuLink className={cls} href={item.href}>
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex flex-row">
          <Link
            href="https://collect.crowded.me/collection/8d1ba838-a38e-4803-b155-d102b7b131e4"
            target="_blank"
            className={cn(
              buttonVariants({
                variant: "link",
                size: "lg",
              }),
              "rounded-[3rem]",
            )}
          >
            Support Us
          </Link>
          <Link
            href="https://airtable.com/appPR9mkslbn3U8YZ/shrHHUtRzK4DqKt3F"
            target="_blank"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
              }),
              "rounded-[3rem]",
            )}
          >
            Apply Now
          </Link>
        </div>
      </header>

      {/* Mobile Navbar */}
      <header className="flex h-[70px] items-center justify-between px-6 md:hidden">
        <Link href="/" className="text-2xl font-bold">
          ámaxa
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>
            <button className="p-2">
              <Menu size={24} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] sm:w-[350px]">
            <div className="mt-8 flex flex-col gap-6">
              {navItems.map((item) => (
                <SheetClose
                  render={
                    <Link
                      href={item.href}
                      className="hover:text-primary text-xl font-medium transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  }
                  key={item.href}
                />
              ))}
              <div className="mt-4 flex flex-col gap-4">
                <SheetClose
                  render={
                    <Link
                      href="https://airtable.com/appPR9mkslbn3U8YZ/shrHHUtRzK4DqKt3F"
                      target="_blank"
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                          size: "lg",
                        }),
                        "w-full rounded-[3rem]",
                      )}
                    >
                      Apply Now
                    </Link>
                  }
                />
                <SheetClose
                  render={
                    <Link
                      href="https://collect.crowded.me/collection/8d1ba838-a38e-4803-b155-d102b7b131e4"
                      target="_blank"
                      className={cn(
                        buttonVariants({
                          variant: "link",
                          size: "lg",
                        }),
                        "w-full rounded-[3rem]",
                      )}
                    >
                      Support Us
                    </Link>
                  }
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
};
