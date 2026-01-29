"use client";

import type { Preloaded } from "convex/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconBuilding } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { regex, type } from "arktype";
import { useMutation, usePreloadedQuery } from "convex/react";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";

import { api } from "@amaxa/backend/_generated/api";
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

export function WorkspacesPageClient({
  preloadedWorkspaces,
}: {
  preloadedWorkspaces: Preloaded<typeof api.workspaces.listAll>;
}) {
  const workspaces = usePreloadedQuery(preloadedWorkspaces);
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <div className="bg-background/95 border-border/50 sticky top-0 z-10 flex flex-row items-center justify-between border-b p-6 backdrop-blur-sm">
        <h1 className="text-xl font-bold">Workspaces</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button size="sm" />}>
            <Plus className="mr-2 h-4 w-4" />
            Create Workspace
          </DialogTrigger>
          <DialogContent>
            <CreateWorkspaceDialog onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <main className="flex-1 p-6">
        {workspaces.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-muted/50 ring-border mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ring-1">
                <IconBuilding className="text-muted-foreground h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No workspaces yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Create your first workspace to start organizing teams and
                projects.
              </p>
              <Button size="sm" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Workspace
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workspaces.map((workspace) => (
                  <TableRow
                    className="hover:bg-muted/50 hover:border-l-primary group cursor-pointer transition-all hover:border-l-2"
                    key={workspace._id}
                    onClick={() =>
                      router.push(`/${workspace.slug}/admin/settings`)
                    }
                  >
                    <TableCell className="font-medium">
                      {workspace.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {workspace.slug}
                    </TableCell>
                    <TableCell>
                      <span className="bg-muted inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium">
                        <Users className="h-3 w-3" />
                        {workspace.userCount}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(workspace.createdAt).toLocaleDateString()}
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

const createWorkspaceSchema = type({
  name: "string > 1",
  slug: regex(/^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/),
});

type CreateWorkspaceSchema = typeof createWorkspaceSchema.infer;

function CreateWorkspaceDialog({ onSuccess }: { onSuccess: () => void }) {
  const createWorkspace = useMutation(api.workspaces.create);

  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
    } satisfies CreateWorkspaceSchema,
    validators: {
      onChange: createWorkspaceSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createWorkspace({
          name: value.name.trim(),
          slug: value.slug.trim(),
        });
        toast.success("Workspace created successfully");
        form.reset();
        onSuccess();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to create workspace",
        );
      }
    },
  });

  const generateSlug = () => {
    const name = form.state.values.name || "";
    const generatedSlug = name
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
        <DialogTitle>Create Workspace</DialogTitle>
        <DialogDescription>
          Create a new workspace to organize teams and projects.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <form.Field name="name">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <FieldContent>
                <Input
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g., Acme Corporation"
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
                  Generate from name
                </Button>
              </div>
              <FieldContent>
                <Input
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    const lowerValue = e.target.value.toLowerCase();
                    field.handleChange(lowerValue);
                  }}
                  placeholder="acme-corp"
                  value={field.state.value}
                />
                <p className="text-muted-foreground mt-1 text-xs">
                  3-50 characters, lowercase letters, numbers, and hyphens only
                </p>
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
              {isSubmitting ? "Creating..." : "Create Workspace"}
            </Button>
          )}
        </form.Subscribe>
      </DialogFooter>
    </form>
  );
}
