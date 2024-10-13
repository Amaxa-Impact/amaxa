import React from "react";

import { GuidesTabs } from "./_components/tabs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-6 p-8">
      <div className="">
        <GuidesTabs />
      </div>
      {children}
    </div>
  );
}
