import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@amaxa/ui";
import { ThemeProvider } from "@amaxa/ui/theme";
import { Toaster } from "@amaxa/ui/toast";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { env } from "~/env";
import FlowProvider from "./_components/flow-provider";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://platform.amaxa.org"
      : "http://localhost:3000",
  ),
  title: "Amaxa Platform",
  description: "Platform for amaxa",
  openGraph: {
    title: "Amaxa Platform",
    description: "Platform for amaxa",
    url: "https://platform.amaxa.org",
    siteName: "Amaxa Platform",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <ThemeProvider defaultTheme="light">
          <TRPCReactProvider>
            <FlowProvider>{props.children}</FlowProvider>
          </TRPCReactProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
