"use client";

import { useMemo } from "react";
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
  const adminIds = useMemo(() => {
    return new Set((siteAdmins ?? []).map((admin) => admin.userId));
  }, [siteAdmins]);

  const adminUsers = useMemo(
    () => allUsers.filter((user) => adminIds.has(user.id)),
    [allUsers, adminIds],
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
