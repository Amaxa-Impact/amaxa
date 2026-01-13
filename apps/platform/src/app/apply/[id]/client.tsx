"use client";

import { IconAlertCircle, IconLock } from "@tabler/icons-react";
import { useQuery } from "convex/react";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";
import { Card, CardContent, CardHeader } from "@amaxa/ui/card";
import { Skeleton } from "@amaxa/ui/skeleton";

import { ApplyForm } from "../_components/apply-form";

interface ApplyPageClientProps {
  formId: Id<"applicationForms">;
}

export function ApplyPageClient({ formId }: ApplyPageClientProps) {
  const form = useQuery(api.applicationForms.getPublicForm, { slug: formId });
  const fields = useQuery(api.applicationFormFields.listByForm, {
    slug: formId,
  });
  const sections = useQuery(api.applicationFormSections.listByFormSlug, {
    slug: formId,
  });

  if (form === undefined || fields === undefined || sections === undefined) {
    return <ApplyFormSkeleton />;
  }

  if (form === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <Card className="mx-auto max-w-md text-center">
          <CardContent className="flex flex-col items-center py-12">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
              <IconLock className="h-7 w-7 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">Form Not Available</h2>
            <p className="text-muted-foreground text-sm">
              This application form is not currently available. It may have been
              unpublished or the link is incorrect.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!Array.isArray(fields)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <Card className="mx-auto max-w-md text-center">
          <CardContent className="flex flex-col items-center py-12">
            <div className="bg-destructive/10 mb-4 flex h-14 w-14 items-center justify-center rounded-full">
              <IconAlertCircle className="text-destructive h-7 w-7" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">Something Went Wrong</h2>
            <p className="text-muted-foreground text-sm">
              We couldn&apos;t load the form. Please try refreshing the page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-b py-8 md:py-12">
      <div className="container mx-auto px-4">
        <ApplyForm
          slug={form.slug}
          fields={fields}
          form={form}
          sections={sections}
        />
      </div>
    </div>
  );
}

function ApplyFormSkeleton() {
  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-b py-8 md:py-12">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-2xl">
          <CardHeader className="border-b">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="mt-2 h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
              <Skeleton className="h-4 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>

            <div className="space-y-6">
              <Skeleton className="h-4 w-32" />
              {[1, 2, 3].map((i) => (
                <div className="space-y-2" key={i}>
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ))}
            </div>

            <div className="flex justify-end border-t pt-6">
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
