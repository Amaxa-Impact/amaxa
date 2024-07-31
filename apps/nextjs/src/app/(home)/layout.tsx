import React from "react";
import Sidebar from "./_components/sidebar";

export default function Layout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {
  return (
    <div>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 pt-2 md:p-8 bg-background">
          {children}
        </main>
        {modal}
      </div>
    </div>
  );
}
