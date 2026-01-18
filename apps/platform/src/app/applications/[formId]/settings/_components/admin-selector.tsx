"use client";

import { UserDropdown } from "@/components/user-dropdown";
import { useQuery } from "convex/react";

import { api } from "@amaxa/backend/_generated/api";

import { useUsers } from "./time-slot-list";

interface AdminSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function AdminSelector({
  value,
  onValueChange,
  className,
}: AdminSelectorProps) {
  const siteAdmins = useQuery(api.interviewTimeSlots.listSiteAdmins);
  const { allUsers, isLoading } = useUsers();

  // Filter users to only show those who are site admins
  const adminUsers = allUsers.filter((user) =>
    siteAdmins?.some((admin) => admin.userId === user.id),
  );

  if (isLoading || !siteAdmins) {
    return (
      <div className={className}>
        <div className="bg-muted h-7 w-full animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <UserDropdown
      className={className ?? ""}
      emptyMessage="No admins found."
      onValueChange={onValueChange}
      placeholder="Select admin..."
      users={adminUsers}
      value={value}
    />
  );
}
