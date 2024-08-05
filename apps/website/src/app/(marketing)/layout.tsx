import React from "react";

import Footer from "./_components/footer";
import { Header } from "./_components/header";

export default function Layout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <div className="overflow-x-hidden">
      <div className="absolute inset-0 -z-10 h-screen w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="h-screenscreen absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]">
          <Header />
          <main className="container overflow-hidden ">{children}</main>
          <Footer />
          {modal}
        </div>
      </div>
    </div>
  );
}
