import { withAuth } from "@workos-inc/authkit-nextjs";
import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import FormEditorClient from "./form-editor-client";

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
      { token: accessToken }
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

export default function EditPage() {
  return <FormEditorClient />;
}
