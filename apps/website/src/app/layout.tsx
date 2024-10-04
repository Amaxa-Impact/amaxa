import "~/app/globals.css";

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
  title: {
    default: "Amaxa",
    template: "Amaxa | %s",
  },
  description: "we help you effect change in the world",
  openGraph: {
    title: "Amaxa",
    description: "we help you effect change in the world",
    url: "https://www.amaxaimpact.org",
    siteName: "Amaxa",
    images: [
      {
        url: "https://www.amaxaimpact.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "Amaxa",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amaxa",
    description: "we help you effect change in the world",
    images: [
      {
        url: "https://www.amaxaimpact.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "Amaxa",
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
      <body>{children}</body>
    </html>
  );
}
