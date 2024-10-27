import React from "react";
import { cookies } from "next/headers";

import { SidebarLayout } from "@amaxa/ui/sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookiesStore = await cookies();
  const isOpen = cookiesStore.get("sidebar:state")?.value === "true";
  return (
    <div>
      <SidebarLayout defaultOpen={isOpen}>{children}</SidebarLayout>
    </div>
  );
}

export const dynamic = "force-dynamic";
