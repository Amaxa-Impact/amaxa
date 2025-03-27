import React from "react";
import Footer from "~/components/footer";
import { Navbar } from "~/components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
