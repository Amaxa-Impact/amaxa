import React from "react";
import Script from "next/script";

import GTMProvider from "~/components/_analytics/GTMProvider";
import GoogleTagManager from "~/components/_analytics/GoogleTagManager";
import AnalyticsRouteListener from "~/components/_analytics/AnalyticsRouteListener";

import Footer from "~/components/footer";
import { Navbar } from "~/components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // Remove <html> and <body> tags - just return the content
    <>
      {/* Google Tag Manager */}
      {/* <Script id="gtm-script" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-M6W47B7Q');
        `}
      </Script> */}

      {/* Google Tag Manager (noscript) */}
      {/* <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-M6W47B7Q"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript> */}

      {/* Route change tracking */}
      {/* <GTMProvider /> */}

      <Navbar />
      <GoogleTagManager />
      <AnalyticsRouteListener />

      {children}
      <Footer />
    </>
  );
}