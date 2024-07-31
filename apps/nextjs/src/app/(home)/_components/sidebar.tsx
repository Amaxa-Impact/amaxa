import { memo } from "react";
import { Poppins } from "next/font/google";
import Link from "next/link";

import type { Session } from "@amaxa/auth";
import { auth } from "@amaxa/auth";
import { Avatar, AvatarFallback } from "@amaxa/ui/avatar";

import SidebarItems from "./sidebar-items";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const Sidebar = async () => {
  const session = await auth();
  if (session === null) return null;

  return (
    <aside className="hidden h-screen min-w-52 border-r border-border bg-background p-4 pt-8 text-primary shadow-inner md:block">
      <div className="flex h-full flex-col justify-between">
        <div className="space-y-4">
          <h3 className={`${poppins.variable} text-3xl font-extrabold`}>
            ámaxa
          </h3>

          <SidebarItems />
        </div>
        <UserDetails session={session} />
      </div>
    </aside>
  );
};

export default memo(Sidebar);

const UserDetails = ({ session }: { session: Session }) => {
  const user = session.user;

  if (!user.name || user.name.length == 0) return null;

  return (
    <Link href="/account">
      <div className="flex w-full items-center justify-between border-t border-border px-2 pt-4">
        <div className="text-muted-foreground">
          <p className="text-xs">{user.name ?? "John Doe"}</p>
          <p className="pr-4 text-xs font-light">
            {user.email ?? "john@doe.com"}
          </p>
        </div>
        <Avatar className="h-10 w-10">
          <AvatarFallback className="border-2 border-border text-muted-foreground">
            {user.name
              ? user.name
                  .split(" ")
                  .map((word) => word[0]?.toUpperCase())
                  .join("")
              : "~"}
          </AvatarFallback>
        </Avatar>
      </div>
    </Link>
  );
};
