"use client";

import type { Preloaded } from "convex/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconForms } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { regex, type } from "arktype";
import { useMutation, usePreloadedQuery } from "convex/react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { api } from "@amaxa/backend/_generated/api";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@amaxa/ui/alert-dialog";
import { Badge } from "@amaxa/ui/badge";
import { Button } from "@amaxa/ui/button";
import { Card, CardContent } from "@amaxa/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@amaxa/ui/dialog";
import { Field, FieldContent, FieldError, FieldLabel } from "@amaxa/ui/field";
import { Input } from "@amaxa/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@amaxa/ui/table";
import { Textarea } from "@amaxa/ui/textarea";

export function ApplicationsPageClient({
  prefetchForms,
}: {
  prefetchForms: Preloaded<typeof api.applicationForms.list>;
}) {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const forms = usePreloadedQuery(prefetchForms);
  const router = useRouter();

  return (
    <div className="flex h-full flex-col">
      <div className="bg-background/95 border-border/50 sticky top-0 z-10 flex flex-row items-center justify-between border-b p-6 backdrop-blur-sm">
        <h1 className="text-xl font-bold">Application Forms</h1>
        <AlertDialog onOpenChange={setIsCreateFormOpen} open={isCreateFormOpen}>
          <AlertDialogTrigger
            className={"flex flex-row items-center gap-2 p-1"}
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
            Create Form
          </AlertDialogTrigger>
          <AlertDialogContent>
            <CreateFormDialog onCreated={() => setIsCreateFormOpen(false)} />
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <main className="flex-1 p-6">
        {forms.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-muted/50 ring-border mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ring-1">
                <IconForms className="text-muted-foreground h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                No application forms yet
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Create your first form to start collecting applications from
                candidates.
              </p>
              <Dialog>
                <DialogTrigger
                  render={() => (
                    <Button size="sm">
                      <Plus className="h-4 w-4" />
                      Create Form
                    </Button>
                  )}
                />
                <DialogContent>
                  <CreateFormDialog />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Responses</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.map((form) => (
                  <TableRow
                    className="hover:bg-muted/50 hover:border-l-primary group cursor-pointer transition-all hover:border-l-2"
                    key={form._id}
                    onClick={() =>
                      router.push(`/applications/${form._id}/edit`)
                    }
                  >
                    <TableCell className="font-medium">{form.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      /apply/{form.slug}
                    </TableCell>
                    <TableCell>
                      <div className="relative inline-block">
                        <Badge
                          variant={form.isPublished ? "default" : "secondary"}
                        >
                          {form.isPublished ? "Published" : "Draft"}
                        </Badge>
                        {form.isPublished && (
                          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                            <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                            <span className="bg-primary relative inline-flex h-2 w-2 rounded-full" />
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="bg-muted inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium">
                        <span className="bg-primary h-1.5 w-1.5 rounded-full" />
                        {form.responseCount}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </main>
    </div>
  );
}

const createFormSchema = type({
  title: "string > 1",
  description: "string",
  slug: regex("[a-z0-9-]"),
});

type CreateFormSchema = typeof createFormSchema.infer;

function CreateFormDialog({ onCreated }: { onCreated?: () => void }) {
  const createForm = useMutation(api.applicationForms.create);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      slug: "",
    } satisfies CreateFormSchema,
    validators: {
      onChange: createFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createForm({
          title: value.title.trim(),
          description: value.description.trim() || undefined,
          slug: value.slug.trim(),
        });
        toast.success("Form created successfully");
        form.reset();
        onCreated?.();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to create form",
        );
      }
    },
  });

  const generateSlug = () => {
    const title = form.state.values.title || "";
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    form.setFieldValue("slug", generatedSlug);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <DialogHeader>
        <DialogTitle>Create Application Form</DialogTitle>
        <DialogDescription>
          Create a new form to collect applications.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <form.Field name="title">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Title</FieldLabel>
              <FieldContent>
                <Input
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g., Summer 2025 Program Application"
                  value={field.state.value}
                />
                <FieldError
                  errors={field.state.meta.errors.map((error) => {
                    if (typeof error === "string") {
                      return { message: error };
                    }
                    return undefined;
                  })}
                />
              </FieldContent>
            </Field>
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>
                Description (optional)
              </FieldLabel>
              <FieldContent>
                <Textarea
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Describe what this application is for..."
                  rows={3}
                  value={field.state.value || ""}
                />
              </FieldContent>
            </Field>
          )}
        </form.Field>

        <form.Field name="slug">
          {(field) => (
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor={field.name}>URL Slug</FieldLabel>
                <Button
                  onClick={generateSlug}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  Generate from title
                </Button>
              </div>
              <FieldContent>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">/apply/</span>
                  <Input
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const lowerValue = e.target.value.toLowerCase();
                      field.handleChange(lowerValue);
                    }}
                    placeholder="summer-2025"
                    value={field.state.value}
                  />
                </div>
                <FieldError
                  errors={field.state.meta.errors.map((error) => {
                    if (typeof error === "string") {
                      return { message: error };
                    }
                    return undefined;
                  })}
                />
              </FieldContent>
            </Field>
          )}
        </form.Field>
      </div>

      <DialogFooter>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button disabled={!canSubmit || isSubmitting} type="submit">
              {isSubmitting ? "Creating..." : "Create Form"}
            </Button>
          )}
        </form.Subscribe>
      </DialogFooter>
    </form>
  );
}
