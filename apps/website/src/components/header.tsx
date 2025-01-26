import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@amaxa/ui/navigation-menu";
import { cn } from "@amaxa/ui";
import { Button } from "@amaxa/ui/button";
import Link from "next/link";

export const Header = () => {
  const cls = cn(
    "text-2xl",

    navigationMenuTriggerStyle(),
  );
  return (
    <header className="w-max-screen  relative hidden h-[108px] flex-row items-center justify-between px-10 md:flex lg:px-8">
      <div>
        <h1 className="text-3xl font-bold">ámaxa</h1>
      </div>

      <NavigationMenu>
        <NavigationMenuList className="text-xl">
          <NavigationMenuItem>
            <Link href="/projects" legacyBehavior passHref>
              <NavigationMenuLink className={cls}>
                Explore Projects
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/projects" legacyBehavior passHref>
              <NavigationMenuLink className={cls}>
                Our Program
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/who-are-we" legacyBehavior passHref>
              <NavigationMenuLink className={cls}>
                Who Are We?
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/support-us" legacyBehavior passHref>
              <NavigationMenuLink className={cls}>
                Who Are We?
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex flex-row gap-[24px]">
        <Button className="bg-primary rounded-[1.5rem]" variant="default">
          Apply Now
        </Button>
        <Button variant="outline" className="rounded-[1.5rem]">Login</Button>
      </div>
    </header>
  );
}
