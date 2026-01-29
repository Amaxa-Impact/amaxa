import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { env } from "@/env";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "@xyflow/react/dist/style.css";
import "./globals.css";

import { ConvexClientProvider } from "@/components/convex-client-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactFlowProvider } from "@xyflow/react";

import { AlertDialogProvider } from "@amaxa/ui/alert-dialog-simple";
import { ConfirmDialogProvider } from "@amaxa/ui/confirm-dialog";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Amaxa Platform",
    template: "%s | Amaxa Platform",
  },
  description:
    "Amaxa Platform - Project management and application form system",
  keywords: [
    "amaxa",
    "platform",
    "project management",
    "applications",
    "tasks",
  ],
  authors: [{ name: "Amaxa" }],
  creator: "Amaxa",
  publisher: "Amaxa",
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Amaxa Platform",
    title: "Amaxa Platform",
    description:
      "Amaxa Platform - Project management and application form system",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amaxa Platform",
    description:
      "Amaxa Platform - Project management and application form system",
  },
  icons: {
    icon: "/convex.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background h-screen antialiased`}
      >
        <ThemeProvider attribute={"class"} forcedTheme="dark">
          <ReactFlowProvider>
            <ConvexClientProvider>
              <ConfirmDialogProvider />
              <AlertDialogProvider />
              <NuqsAdapter>{children}</NuqsAdapter>
            </ConvexClientProvider>
          </ReactFlowProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
