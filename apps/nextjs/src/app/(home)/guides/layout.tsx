import React from "react";

import { GuidesTabs } from "./_components/tabs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <GuidesTabs />
      {children}
    </div>
  );
}
