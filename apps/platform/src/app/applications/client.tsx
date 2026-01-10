"use client";

import { useForm } from "@tanstack/react-form";
import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { IconForms } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";

export function ApplicationsPageClient({
  prefetchForms,
}: {
  prefetchForms: Preloaded<typeof api.applicationForms.list>;
}) {
  const forms = usePreloadedQuery(prefetchForms);
  const router = useRouter();

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 flex flex-row items-center justify-between bg-background/95 backdrop-blur-sm border-b border-border/50 p-6">
        <h1 className="font-bold text-xl">Application Forms</h1>
        <Dialog>
          <DialogTrigger
            render={() => (
              <Button className="ml-2 group transition-all hover:shadow-sm hover:shadow-primary/20" size="sm" variant="outline">
                <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                Create Form
              </Button>
            )}
          />
          <DialogContent>
            <CreateFormDialog />
          </DialogContent>
        </Dialog>
      </div>

      <main className="flex-1 p-6">
        {forms.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 ring-1 ring-border">
                <IconForms className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 font-semibold text-lg">No application forms yet</h3>
              <p className="mb-6 max-w-sm text-muted-foreground">
                Create your first form to start collecting applications from candidates.
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
                    className="cursor-pointer transition-all hover:bg-muted/50 hover:border-l-2 hover:border-l-primary group"
                    key={form._id}
                    onClick={() => router.push(`/applications/${form._id}/edit`)}
                  >
                    <TableCell className="font-medium">{form.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      /apply/{form.slug}
                    </TableCell>
                    <TableCell>
                      <div className="relative inline-block">
                        <Badge variant={form.isPublished ? "default" : "secondary"}>
                          {form.isPublished ? "Published" : "Draft"}
                        </Badge>
                        {form.isPublished && (
                          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
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

const createFormSchema = z.object({
  title: z.string().min(1, "Title is required.").trim(),
  description: z.string(),
  slug: z
    .string()
    .min(1, "Slug is required.")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
});

type CreateFormSchema = z.infer<typeof createFormSchema>;

function CreateFormDialog() {
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
          description: value.description?.trim() || undefined,
          slug: value.slug.trim(),
        });
        toast.success("Form created successfully");
        form.reset();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to create form"
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
        form.handleSubmit();
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
