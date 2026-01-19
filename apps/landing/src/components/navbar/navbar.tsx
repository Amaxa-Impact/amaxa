import { cn } from "@amaxa/ui";
import { buttonVariants } from "@amaxa/ui/button";

import { DesktopMenu } from "./desktop";
import { MobileMenu } from "./mobile";

const navItems = [
  { href: "/pathways", label: "Our Pathways" },
  { href: "/project", label: "Projects" },
  { href: "/project-stories", label: "Read Àmaxa Stories" },
  { href: "/platform", label: "Platform" },
  { href: "/blog", label: "Blog" },
  { href: "/contact-us", label: "Contact" },
];

export function Navbar() {
  return (
    <>
      {/* Green Banner */}
      <a
        href="https://airtable.com/appPR9mkslbn3U8YZ/shrHHUtRzK4DqKt3F"
        className="block bg-[#abc468] px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-black"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-1">
          <span>Application to an Ámaxa Pathway.</span>
          <span className="font-semibold underline">Apply here now!</span>
        </div>
      </a>

      {/* Desktop Navbar */}
      <header className="w-max-screen relative hidden h-[89px] flex-row items-center justify-between px-10 md:flex lg:px-8">
        <div>
          <a href="/" className="text-3xl font-bold">
            ámaxa
          </a>
        </div>

        <DesktopMenu navItems={navItems} />

        <div className="flex flex-row">
          <a
            href="https://collect.crowded.me/collection/8d1ba838-a38e-4803-b155-d102b7b131e4"
            target="_blank"
            className={cn(
              buttonVariants({ variant: "link", size: "lg" }),
              "rounded-[3rem]",
            )}
          >
            Support Us
          </a>
          <a
            href="https://airtable.com/appPR9mkslbn3U8YZ/shrHHUtRzK4DqKt3F"
            target="_blank"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-[3rem]",
            )}
          >
            Apply Now
          </a>
        </div>
      </header>

      {/* Mobile Navbar */}
      <header className="flex h-[70px] items-center justify-between px-6 md:hidden">
        <a href="/" className="text-2xl font-bold">
          ámaxa
        </a>
        <MobileMenu navItems={navItems} />
      </header>
    </>
  );
}
