import React, { Suspense } from "react";

import AnalyticsRouteListener from "~/components/_analytics/AnalyticsRouteListener";
import GoogleTagManager from "~/components/_analytics/GoogleTagManager";
import Footer from "~/components/footer";
import { Navbar } from "~/components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <GoogleTagManager />
        <AnalyticsRouteListener />
      </Suspense>
      {children}
      <Footer />
    </>
  );
}
