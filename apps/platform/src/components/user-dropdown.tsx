"use client";

import { useMemo } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/kibo-ui/combobox";

import { cn } from "@amaxa/ui";

export interface UserOption {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

export interface UserDropdownProps {
  /** Array of users to display in the dropdown */
  users: UserOption[];
  /** Currently selected user ID */
  value: string;
  /** Callback when selection changes */
  onValueChange: (userId: string) => void;
  /** Placeholder text when no selection */
  placeholder?: string;
  /** Whether the dropdown is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Show an "Unassigned" option at the top */
  showUnassigned?: boolean;
  /** Label for the unassigned option */
  unassignedLabel?: string;
  /** User IDs to exclude from the list */
  excludeUserIds?: string[];
  /** Loading state */
  isLoading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** ID for form association */
  id?: string;
  /** aria-invalid for form validation */
  "aria-invalid"?: boolean;
}

function getUserDisplayName(user: UserOption): string {
  if (user.email) {
    return user.email;
  }
  if (user.firstName) {
    return user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName;
  }
  return user.id;
}

export function UserDropdown({
  users,
  value,
  onValueChange,
  placeholder = "Select user...",
  disabled = false,
  className,
  showUnassigned = false,
  unassignedLabel = "Unassigned",
  excludeUserIds = [],
  isLoading = false,
  emptyMessage = "No users found.",
  id,
  "aria-invalid": ariaInvalid,
}: UserDropdownProps) {
  const filteredUsers = useMemo(() => {
    const excludeSet = new Set(excludeUserIds);
    return users.filter((user) => !excludeSet.has(user.id));
  }, [users, excludeUserIds]);

  const options = useMemo(() => {
    const userOptions = filteredUsers.map((user) => ({
      value: user.id,
      label: getUserDisplayName(user),
    }));

    if (showUnassigned) {
      return [{ value: "", label: unassignedLabel }, ...userOptions];
    }

    return userOptions;
  }, [filteredUsers, showUnassigned, unassignedLabel]);

  if (isLoading) {
    return (
      <div
        className={cn(
          "bg-muted h-7 w-full animate-pulse rounded-md",
          className,
        )}
      />
    );
  }

  return (
    <Combobox
      data={options}
      onValueChange={onValueChange}
      type="user"
      value={value}
    >
      <ComboboxTrigger
        aria-invalid={ariaInvalid}
        className={cn("w-full", className)}
        disabled={disabled}
        id={id}
      />
      <ComboboxContent>
        <ComboboxInput placeholder={placeholder} />
        <ComboboxList>
          <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
          <ComboboxGroup>
            {options.map((option) => (
              <ComboboxItem
                key={option.value || "__unassigned__"}
                value={option.value}
              >
                {option.label}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export { getUserDisplayName };
