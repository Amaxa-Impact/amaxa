"use client";

import { useApplicationForm } from "@/components/application/context";

import { SchedulingSettings } from "../settings/scheduling-settings";

export default function Page() {
  const form = useApplicationForm();

  return (
    <main className="container mx-auto p-4">
      <SchedulingSettings formId={form._id} />
    </main>
  );
}
