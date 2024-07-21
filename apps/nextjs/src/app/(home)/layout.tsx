import React from "react";

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div>
      <main className="flex flex-col p-10">{children}</main>
    </div>
  );
}
