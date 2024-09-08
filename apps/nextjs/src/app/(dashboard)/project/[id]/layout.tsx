import React from "react";

import { SidebarLayout } from "@amaxa/ui/sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { cookies } = await import("next/headers");
  return (
    <div>
      <SidebarLayout
        defaultOpen={cookies().get("sidebar:state")?.value === "true"}
      >
        {children}
      </SidebarLayout>
    </div>
  );
}

export const dynamic = "force-dynamic";
