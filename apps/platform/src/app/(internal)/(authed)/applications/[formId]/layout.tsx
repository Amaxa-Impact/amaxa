import type { Metadata } from "next";
import { ApplicationFormProvider } from "@/components/application/context";
import { ApplicationNavbar } from "@/components/application/navbar";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { fetchQuery } from "convex/nextjs";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    formId: Id<"applicationForms">;
  }>;
}): Promise<Metadata> {
  const [{ formId }, { accessToken }] = await Promise.all([
    params,
    withAuth({
      ensureSignedIn: true,
    }),
  ]);

  try {
    const form = await fetchQuery(
      api.applicationForms.get,
      { formId },
      { token: accessToken },
    );

    if (!form) {
      return {
        title: "Application Form",
        description: "Manage application form settings and responses",
      };
    }

    return {
      title: form.title,
      description: form.description ?? `Manage ${form.title} application form`,
    };
  } catch {
    return {
      title: "Application Form",
      description: "Manage application form settings and responses",
    };
  }
}

export default async function RouteComponent({
  params,
  children,
}: {
  params: Promise<{
    formId: string;
  }>;
  children: React.ReactNode;
}) {
  const formId = (await params).formId as Id<"applicationForms">;
  return (
    <div>
      <ApplicationFormProvider formId={formId}>
        <ApplicationNavbar id={formId} />
        {children}
      </ApplicationFormProvider>
    </div>
  );
}
