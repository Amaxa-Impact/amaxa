import type { Metadata } from "next";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { fetchQuery } from "convex/nextjs";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";

import ResponsesPageClient from "./responses-client";

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
        title: "Form Responses",
        description: "View and manage application form responses",
      };
    }

    return {
      title: `Responses - ${form.title}`,
      description: `View and manage responses for ${form.title} application form`,
    };
  } catch {
    return {
      title: "Form Responses",
      description: "View and manage application form responses",
    };
  }
}

export default function ResponsesPage() {
  return <ResponsesPageClient />;
}
