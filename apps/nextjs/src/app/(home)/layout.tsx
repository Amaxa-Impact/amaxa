import React, { Suspense } from "react";

import { isAdmin } from "@amaxa/api";

import { AppHeader } from "~/components/app-header";
import { AppNav } from "~/components/layout-tabs";
import { checkAuth } from "~/lib/auth";

export default async function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const auth = await checkAuth();
  const links = [
    { href: "/", label: "Projects" },
    { href: "/events", label: "Events" },
    { href: "/guides/action-guides", label: "Guides" },
    isAdmin(auth)
      ? { href: "/admin", label: "Admin" }
      : {
          href: "",
          label: "",
        },
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
