import type { Metadata } from "next";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { fetchQuery } from "convex/nextjs";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";

import SettingsPageClient from "./settings-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    formId: Id<"applicationForms">;
  }>;
}): Promise<Metadata> {
  const { formId } = await params;
  const { accessToken } = await withAuth();

  try {
    const form = await fetchQuery(
      api.applicationForms.get,
      { formId },
      { token: accessToken },
    );

    if (!form) {
      return {
        title: "Form Settings",
        description: "Manage application form settings",
      };
    }

    return {
      title: `Settings - ${form.title}`,
      description: `Manage settings for ${form.title} application form`,
    };
  } catch {
    return {
      title: "Form Settings",
      description: "Manage application form settings",
    };
  }
}

export default function SettingsPage() {
  return <SettingsPageClient />;
}
