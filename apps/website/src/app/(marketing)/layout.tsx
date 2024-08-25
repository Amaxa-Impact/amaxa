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
      <Header />
      <main className="container overflow-x-hidden ">{children}</main>
      <Footer />
      {modal}
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(160,100,255,0.25),rgba(255,255,255,0))]"></div>
    </div>
  );
}
