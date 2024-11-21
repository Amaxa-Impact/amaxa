"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { MobileNav } from "~/components/mobile-nav";
import { ApplyButton } from "./apply-button";
import NavigationSection from "./nav";

export const Header = () => {
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  React.useEffect(() => {
    const closeMobileMenuOnClickOutside = () => {
      if (showMobileMenu) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("click", closeMobileMenuOnClickOutside);

    return () => {
      document.removeEventListener("click", closeMobileMenuOnClickOutside);
    };
  }, [showMobileMenu]);

  return (
    <div className="flex flex-row items-start justify-between px-5 pt-10 md:items-center md:justify-evenly">
      <Link className="flex items-center gap-2" href="/">
        <div />
        <span className="self-center whitespace-nowrap text-2xl font-bold dark:text-white">
          ámaxa
        </span>
      </Link>
      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={toggleMobileMenu}
      >
        {showMobileMenu ? <Menu /> : <Menu />}
      </button>
      {showMobileMenu && (
        <MobileNav
          items={[
            {
              title: "Projects",
              href: "/project",
            },
            {
              title: "How we work",
              href: "/about-us",
            },
            {
              title: "Meet the Team",
              href: "/team",
            },
            {
              title: "Blog",
              href: "/blog",
            },
            {
              title: "Platform",
              href: "/platform",
            },
          ]}
        />
      )}
      <NavigationSection />
      <div className="hidden gap-4 md:flex  md:flex-row">
        <Suspense>
          <ApplyButton />
        </Suspense>
      </div>
    </div>
  );
};
