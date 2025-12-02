import "~/app/globals.css";

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

// import { CSPostHogProvider } from "./_providers/providers";

export const metadata: Metadata = {
  title: {
    default: "amaxa",
    template: "amaxa | %s",
  },
  description:
    "We are ámaxa: an organization dedicated to removing barriers for anyone who want to effect positive change in the world through focused initiatives centered on sustainability, human rights, equity and education. Join us today.",
  openGraph: {
    title: "àmaxa: where anyone can effect real change",
    description:
      "We are ámaxa: an organization dedicated to removing barriers for anyone who want to effect positive change in the world through focused initiatives centered on sustainability, human rights, equity and education. Join us today.",
    url: "https://www.amaxaimpact.org",
    siteName: "amaxa",
    images: [
      {
        url: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOexh9L5yvrS3NH5LD0fGBOXwFydpiVbYzJMa1",
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
    description:
      "We are ámaxa: an organization dedicated to removing barriers for anyone who want to effect positive change in the world through focused initiatives centered on sustainability, human rights, equity and education. Join us today.",
    images: [
      {
        url: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOexh9L5yvrS3NH5LD0fGBOXwFydpiVbYzJMa1",
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
    <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
