import { cn } from "@amaxa/ui";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@amaxa/ui/navigation-menu";

interface NavItem {
  href: string;
  label: string;
}

export const DesktopMenu = ({ navItems }: { navItems: NavItem[] }) => {
  const cls = cn("text-2xl", navigationMenuTriggerStyle());

  return (
    <NavigationMenu>
      <NavigationMenuList className="text-xl">
        {navItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink render={<a href={item.href} className={cls} />}>
              {item.label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
