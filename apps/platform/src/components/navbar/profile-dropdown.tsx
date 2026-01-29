"use client";

import { memo } from "react";
import Link from "next/link";
import { useAuthContext } from "@/lib/auth/auth-context";
import { LogOut, Settings, Shield, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@amaxa/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@amaxa/ui/dropdown-menu";
import { Skeleton } from "@amaxa/ui/skeleton";

function getInitials(
  firstName: string | null,
  lastName: string | null,
): string {
  const first = firstName?.charAt(0).toUpperCase() ?? "";
  const last = lastName?.charAt(0).toUpperCase() ?? "";
  return first + last || "U";
}

export const ProfileDropdown = memo(function ProfileDropdown() {
  const { user, isAdmin, isLoading } = useAuthContext();

  if (isLoading) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (!user) {
    return null;
  }

  const initials = getInitials(user.firstName, user.lastName);
  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage alt={displayName} src={user.profilePictureUrl ?? ""} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{displayName}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/settings" />}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/settings" />}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem render={<Link href="/admin" />}>
              <Shield className="mr-2 h-4 w-4" />
              Admin
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/sign-out" />}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
