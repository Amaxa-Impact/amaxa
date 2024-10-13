import React, { Suspense } from "react";

import { AppHeader } from "~/components/app-header";
import { AppNav } from "~/components/layout-tabs";

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
        <div className="">
          <Suspense fallback={<div>loading..</div>}>
            <AppHeader />
            <AppNav links={links} className="bg-secondary/40 " />
          </Suspense>
        </div>
        <main className="">{children}</main>
      </div>
      {modal}
    </div>
  );
}
