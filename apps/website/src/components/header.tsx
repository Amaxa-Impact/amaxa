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

export const Navbar = () => {
  const cls = cn(
    "text-2xl",

    navigationMenuTriggerStyle(),
  );
  return (
    <header className="w-max-screen  relative hidden h-[89px] flex-row items-center justify-between px-10 md:flex lg:px-8">
      <div>
        <Link href="/" className="text-3xl font-bold">ámaxa</Link>
      </div>

      <NavigationMenu>
        <NavigationMenuList className="text-xl">
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
                Who Are We
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex flex-row gap-[24px]">
        <Button className="rounded-[3rem]">Apply Now</Button>
        <Link
          href="https://app.amaxaimpact.org"
          target="_blank"
          className={cn(
            buttonVariants({
              variant: "outline"
            }),
            "rounded-[3rem]"
          )}>
          Login
        </Link>
      </div>
    </header >
  );
};
