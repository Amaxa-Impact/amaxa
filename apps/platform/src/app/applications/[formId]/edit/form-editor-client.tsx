"use client";

import { useParams } from "next/navigation";
import { useApplicationForm } from "@/components/application/context";
import { FormBuilder, FormHeader } from "@/components/form-builder";
import { useQuery } from "convex/react";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";

export default function FormEditorClient() {
  const { formId } = useParams<{ formId: Id<"applicationForms"> }>();
  const fields = useQuery(api.applicationFormFields.listByFormId, { formId });
  const form = useApplicationForm();

  return (
    <div className="flex h-screen flex-col">
      <main className="bg-background flex-1 overflow-auto">
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-6">
          <FormHeader form={form} formId={formId} />

          <FormBuilder fields={fields} formId={formId} />
        </div>
      </main>
    </div>
  );
}
