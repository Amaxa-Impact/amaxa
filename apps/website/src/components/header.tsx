

// export const Navbar = () => {
//   const cls = cn(
//     "text-2xl",

//     navigationMenuTriggerStyle(),
//   );
//   return (
//     <header className="w-max-screen  relative hidden h-[89px] flex-row items-center justify-between px-10 md:flex lg:px-8">
//       <div>
//         <Link href="/" className="text-3xl font-bold">ámaxa</Link>
//       </div>

//       <NavigationMenu>
//         <NavigationMenuList className="text-xl">
//           <NavigationMenuItem>
//             <Link href="/project" legacyBehavior passHref>
//               <NavigationMenuLink className={cls}>
//                 Explore Projects
//               </NavigationMenuLink>
//             </Link>
//           </NavigationMenuItem>
//           <NavigationMenuItem>
//             <Link href="/program" legacyBehavior passHref>
//               <NavigationMenuLink className={cls}>
//                 Our Cohorts
//               </NavigationMenuLink>
//             </Link>
//           </NavigationMenuItem>
//           <NavigationMenuItem>
//             <Link href="/who-are-we" legacyBehavior passHref>
//               <NavigationMenuLink className={cls}>
//                 Who We Are
//               </NavigationMenuLink>
//             </Link>
//           </NavigationMenuItem>
//         </NavigationMenuList>
//       </NavigationMenu>

//       <div className="flex flex-row gap-[24px]">
//         {/* <Button href="https://airtable.com/appPR9mkslbn3U8YZ/shrHHUtRzK4DqKt3F" className="rounded-[3rem]">Apply Now</Button> */}
//         <Link
//           href="https://airtable.com/appPR9mkslbn3U8YZ/shrHHUtRzK4DqKt3F"
//           target="_blank"
//           className={cn(
//             buttonVariants({
//               // variant: "outline"
//             }),
//             "rounded-[3rem]"
//           )}>
//           Apply Now
//         </Link>
//         <Link
//           href="https://app.amaxaimpact.org"
//           target="_blank"
//           className={cn(
//             buttonVariants({
//               variant: "outline"
//             }),
//             "rounded-[3rem]"
//           )}>
//           Login
//         </Link>
//       </div>
//     </header >
//   );
// };
"use client";  // Marking the component as a client-side component

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Button, buttonVariants } from "@amaxa/ui/button";
import { cn } from "@amaxa/ui";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // Importing icons for the hamburger and close icons
import { useEffect } from 'react'; // Added import for useEffect


export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to control mobile menu visibility

  const cls = cn(
    "text-2xl",
    navigationMenuTriggerStyle(),
  );

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('hamburger-open');
    } else {
      document.body.classList.remove('hamburger-open');
    }
  }, [isOpen]);

  return (
    <header className="relative w-full h-[89px] flex justify-between items-center px-10 md:px-8">
      {/* Logo on desktop only */}
      <div className="hidden md:block">
        <Link href="/" className="text-3xl font-bold">
          ámaxa
        </Link>
      </div>

      {/* Hamburger icon on mobile */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} className="text-2xl">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation - It opens vertically below the hamburger icon */}
      <div
  className={`md:hidden ${isOpen ? "block" : "hidden"} absolute top-full left-0 w-full bg-white shadow-lg z-50`} 
    // `absolute top-full` ensures it opens below the hamburger icon
      >
        <NavigationMenu className="w-full">
          <NavigationMenuList className="text-xl flex flex-col justify-start items-start w-full px-4">
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={cls}>Home</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/project" legacyBehavior passHref>
                <NavigationMenuLink className={cls}>Explore Projects</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/program" legacyBehavior passHref>
                <NavigationMenuLink className={cls}>
                  Our Cohorts
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/who-are-we" legacyBehavior passHref>
                <NavigationMenuLink className={cls}>
                  Who We Are
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Desktop Navigation - Stays Horizontal */}
      <div className="hidden md:flex w-full justify-center">
        <NavigationMenu>
          <NavigationMenuList className="text-xl flex justify-center">
            <NavigationMenuItem>
              <Link href="/project" legacyBehavior passHref>
                <NavigationMenuLink className={cls}>
                  Explore Projects
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/program" legacyBehavior passHref>
                <NavigationMenuLink className={cls}>
                  Our Cohorts
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/who-are-we" legacyBehavior passHref>
                <NavigationMenuLink className={cls}>
                  Who We Are
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Button Section */}
      <div className="flex gap-[24px]">
        <Link
          href="https://airtable.com/appPR9mkslbn3U8YZ/shrHHUtRzK4DqKt3F"
          target="_blank"
          className={cn(
            buttonVariants(),
            "rounded-[3rem]"
          )}>
          Apply Now
        </Link>
        <Link
          href="https://app.amaxaimpact.org"
          target="_blank"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "rounded-[3rem]"
          )}>
          Login
        </Link>
      </div>
    </header>
  );
};

