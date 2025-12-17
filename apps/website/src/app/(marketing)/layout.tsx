import React, { Suspense } from "react";

import AnalyticsRouteListener from "~/components/_analytics/AnalyticsRouteListener";
import GoogleTagManager from "~/components/_analytics/GoogleTagManager";

import Footer from "~/components/footer";
import { Navbar } from "~/components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
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
      </head>
      <body>
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
        <Suspense fallback={<div>Loading...</div>}>
          <GoogleTagManager />
          <AnalyticsRouteListener />
        </Suspense>

        {children}
        <Footer />
      </body>
    </html>
  );
}
