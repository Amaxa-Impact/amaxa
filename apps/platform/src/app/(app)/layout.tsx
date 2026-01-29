import type { ReactNode } from "react";

import { TopNavbar } from "@/components/navbar/top-navbar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <TopNavbar />
      {children}
    </>
  );
}
