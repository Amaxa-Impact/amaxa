import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";

import { ApplyPageClient } from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const slug = id;

  try {
    const form = await fetchQuery(api.applicationForms.getPublicForm, { slug });

    if (!form) {
      return {
        title: "Application Form Not Found",
        description: "The requested application form is not available.",
      };
    }

    return {
      title: form.title,
      description:
        form.description ?? `Submit your application for ${form.title}`,
      openGraph: {
        title: form.title,
        description:
          form.description ?? `Submit your application for ${form.title}`,
      },
    };
  } catch {
    return {
      title: "Apply",
      description: "Submit your application",
    };
  }
}

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const formId = id as Id<"applicationForms">;

  return <ApplyPageClient formId={formId} />;
}
