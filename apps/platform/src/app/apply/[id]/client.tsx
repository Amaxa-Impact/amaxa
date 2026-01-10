"use client";

import { IconAlertCircle, IconLock } from "@tabler/icons-react";
import { useQuery } from "convex/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { ApplyForm } from "../_components/apply-form";

interface ApplyPageClientProps {
  formId: Id<"applicationForms">;
}

export function ApplyPageClient({ formId }: ApplyPageClientProps) {
  const form = useQuery(api.applicationForms.getPublicForm, { slug: formId });
  const fields = useQuery(api.applicationFormFields.listByForm, {
    slug: formId,
  });

  if (form === undefined || fields === undefined) {
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
            <h2 className="mb-2 font-semibold text-lg">Form Not Available</h2>
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
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <IconAlertCircle className="h-7 w-7 text-destructive" />
            </div>
            <h2 className="mb-2 font-semibold text-lg">Something Went Wrong</h2>
            <p className="text-muted-foreground text-sm">
              We couldn&apos;t load the form. Please try refreshing the page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <ApplyForm fields={fields} form={form} />
      </div>
    </div>
  );
}

function ApplyFormSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-2xl">
          <CardHeader className="border-b">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="mt-2 h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
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
