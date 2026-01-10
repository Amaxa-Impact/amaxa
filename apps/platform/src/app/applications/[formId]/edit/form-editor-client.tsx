"use client";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useApplicationForm } from "@/components/application/context";
import { FormBuilder, FormHeader } from "@/components/form-builder";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export default function FormEditorClient() {
  const { formId } = useParams<{ formId: Id<"applicationForms"> }>();
  const fields = useQuery(api.applicationFormFields.listByFormId, { formId });
  const form = useApplicationForm();

  if (!form) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Form not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <main className="flex-1 overflow-auto bg-background">
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-6">
          <FormHeader form={form} formId={formId} />

          <FormBuilder fields={fields} formId={formId} />
        </div>
      </main>
    </div>
  );
}
