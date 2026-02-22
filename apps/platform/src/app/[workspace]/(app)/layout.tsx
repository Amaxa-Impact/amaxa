import type React from "react";

import { WorkspaceNavbar } from "./_components/workspace-navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <WorkspaceNavbar />
      {children}
    </div>
  );
}
