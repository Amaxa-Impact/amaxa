import type { Metadata } from "next";
import { requireSiteAdmin } from "@/lib/auth/dal";
import { preloadQuery } from "convex/nextjs";

import { api } from "@amaxa/backend/_generated/api";

import { ApplicationsPageClient } from "./client";

export const metadata: Metadata = {
  title: "Application Forms",
  description: "Create and manage application forms on the Amaxa Platform",
};

export default async function ApplicationsPage() {
  const { accessToken } = await requireSiteAdmin();

  const prefetchForms = await preloadQuery(
    api.applicationForms.list,
    {},
    { token: accessToken },
  );

  return (
    <div>
      <ApplicationsPageClient prefetchForms={prefetchForms} />
    </div>
  );
}
