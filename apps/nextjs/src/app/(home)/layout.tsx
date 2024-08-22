import React from "react";

import { Component } from "~/components/layout-tabs";

export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const links = [
    { href: "/", label: "Projects" },
    { href: "/events", label: "Events" },
    { href: "/guides/action-guides", label: "Guides" },
  ];

  return (
    <div>
      <div className="flex flex-col">
        <Component links={links} className="bg-secondary/40" />
        <main className="">{children}</main>
      </div>
      {modal}
    </div>
  );
}
