import "~/app/globals.css";

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import { CSPostHogProvider } from "./provides/posthog";

export const metadata: Metadata = {
  title: {
    default: "amaxa",
    template: "amaxa | %s",
  },
  description: "we help you effect change in the world",
  openGraph: {
    title: "amaxa",
    description: "we help you effect change in the world",
    url: "https://www.amaxaimpact.org",
    siteName: "amaxa",
    images: [
      {
        url: "https://www.amaxaimpact.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "amaxa",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "amaxa",
    description: "we help you effect change in the world",
    images: [
      {
        url: "https://www.amaxaimpact.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "amaxa",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "nonprofits",
    "communities",
    "the world",
    "your passion",
    "social impact",
    "volunteering",
    "ámaxa",
    "amaxa",
    "amaxaimapct",
    "amaxaimapct",
    "impact",
    "college admissions",
    "college",
    "college application",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <CSPostHogProvider>{children}</CSPostHogProvider>
      </body>
    </html>
  );
}
