"use client";

import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { UserDropdown } from "@/components/ui/user-dropdown";
import { api } from "@/convex/_generated/api";
import type { User } from "@/lib/workos";

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
  const [allUsers, setAllUsers] = useState<User>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const data = await response.json();
          // API returns array directly, not { users: [...] }
          setAllUsers(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter users to only show those who are site admins
  const adminUsers = allUsers.filter((user) =>
    siteAdmins?.some((admin) => admin.userId === user.id)
  );

  if (isLoading || !siteAdmins) {
    return (
      <div className={className}>
        <div className="h-7 w-full animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  return (
    <UserDropdown
      className={className}
      emptyMessage="No admins found."
      onValueChange={onValueChange}
      placeholder="Select admin..."
      searchPlaceholder="Search admins..."
      users={adminUsers}
      value={value}
    />
  );
}
