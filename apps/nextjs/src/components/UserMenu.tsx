import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@amaxa/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { SignOut } from "./SignOut";
import { ThemeSwitch } from "./theme-switch";
import { Avatar, AvatarFallback } from "@amaxa/ui/avatar";
import { auth } from "@amaxa/auth";

export async function UserMenu({ onlySignOut }: { onlySignOut?: boolean }) {
  const session = await auth();
  const user = session?.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer rounded-full">
          {user?.image && (
            <Image
              src={user?.image}
              alt={user.name ?? ""}
              width={32}
              height={32}
            />
          )}
          <AvatarFallback>
            <span className="text-xs">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]" sideOffset={10} align="end">
        {!onlySignOut && (
          <>
            <DropdownMenuLabel>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="truncate">{user?.name}</span>
                  <span className="truncate text-xs font-normal text-[#606060]">
                    {user?.email}
                  </span>
                </div>
                <div className="rounded-full border px-3 py-0.5 text-[11px] font-normal">
                  Beta
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <Link href="/account">
                <DropdownMenuItem>Account</DropdownMenuItem>
              </Link>

              <Link href="/docs">
                <DropdownMenuItem>Support</DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <div className="flex flex-row items-center justify-between p-2">
              <p className="text-sm">Theme</p>
              <ThemeSwitch />
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        <SignOut />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
