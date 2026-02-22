import type { Metadata } from "next";
import { requireSiteAdmin } from "@/lib/auth/dal";
import { preloadQuery } from "convex/nextjs";

import { api } from "@amaxa/backend/_generated/api";

import { TemplatesPageClient } from "./client";

export const metadata: Metadata = {
  title: "Global Templates",
  description: "Manage global project templates",
};

export default async function TemplatesPage() {
  const { accessToken } = await requireSiteAdmin();

  const preloadedTemplates = await preloadQuery(
    api.projectTemplates.listGlobal,
    {},
    { token: accessToken },
  );

  return <TemplatesPageClient preloadedTemplates={preloadedTemplates} />;
}
