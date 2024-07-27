"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { DropdownMenuItem } from "@amaxa/ui/dropdown-menu";

export function SignOut() {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    setLoading(true);
    router.push("/sign-out");
    router.refresh();
  };

  return (
    <DropdownMenuItem onClick={handleSignOut}>
      {isLoading ? "Loading..." : "Sign out"}
    </DropdownMenuItem>
  );
}
