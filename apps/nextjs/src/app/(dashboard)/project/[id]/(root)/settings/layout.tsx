import { cache } from "react";

import type { NavItem } from "./_components/types";
import Sidebar from "./_components/sidebar";

const getNavItems = cache((id: string) => {
  const navItems: NavItem[] = [
    { href: `/project/${id}/settings`, label: "Settings" },
  ];
  return navItems;
});

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    id: string;
  };
}) {
  const navItems = getNavItems(params.id);
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <Sidebar navItems={navItems} />
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
