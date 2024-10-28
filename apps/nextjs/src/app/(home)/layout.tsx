import React, { Suspense } from "react";

import { isAdmin } from "@amaxa/api";

import { AppHeader } from "~/components/app-header";
import { AppNav } from "~/components/layout-tabs";

export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-col">
        <div className="">
          <Suspense fallback={<div>loading..</div>}>
            <AppHeader />
            <AppNav className="bg-secondary/40 " />
          </Suspense>
        </div>
        <main className="">{children}</main>
      </div>
      {modal}
    </div>
  );
}
