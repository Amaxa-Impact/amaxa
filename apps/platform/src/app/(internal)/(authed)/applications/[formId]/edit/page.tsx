import type { Metadata } from "next";
import { getOptionalSession, requireSiteAdmin } from "@/lib/auth/dal";
import { fetchQuery } from "convex/nextjs";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";

import FormEditorClient from "./form-editor-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    formId: Id<"applicationForms">;
  }>;
}): Promise<Metadata> {
  const { formId } = await params;
  const session = await getOptionalSession();

  if (!session) {
    return {
      title: "Edit Form",
      description: "Edit application form fields and settings",
    };
  }

  try {
    const form = await fetchQuery(
      api.applicationForms.get,
      { formId },
      { token: session.accessToken },
    );

    if (!form) {
      return {
        title: "Edit Form",
        description: "Edit application form fields and settings",
      };
    }

    return {
      title: `Edit ${form.title}`,
      description: `Edit fields and settings for ${form.title}`,
    };
  } catch {
    return {
      title: "Edit Form",
      description: "Edit application form fields and settings",
    };
  }
}

export default async function EditPage() {
  await requireSiteAdmin();
  return <FormEditorClient />;
}
