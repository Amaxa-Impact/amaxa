"use client";

import type { WorkspaceData } from "@/components/workspace/context";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/components/workspace/context";
import { useForm } from "@tanstack/react-form";
import { type } from "arktype";
import { useMutation } from "convex/react";
import { Trash2 } from "lucide-react";

import { toast } from "sonner";

import { api } from "@amaxa/backend/_generated/api";
import { AdminContainer } from "../_components/admin-container";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@amaxa/ui/alert-dialog";
import { Button } from "@amaxa/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@amaxa/ui/card";
import { Field, FieldContent, FieldError, FieldLabel } from "@amaxa/ui/field";
import { Input } from "@amaxa/ui/input";

export function WorkspaceSettingsClient() {
  const { workspace } = useWorkspace();
  const router = useRouter();

  return (
    <AdminContainer
      title="Settings"
      description={`Configure ${workspace.name} workspace settings`}
    >
      <WorkspaceNameForm workspace={workspace} />
      <DangerZone
        workspaceId={workspace.id}
        onDeleted={() => router.push("/workspaces")}
      />
    </AdminContainer>
  );
}

const updateNameSchema = type({
  name: "string > 1",
});

function WorkspaceNameForm({ workspace }: { workspace: WorkspaceData }) {
  const updateWorkspace = useMutation(api.workspaces.update);

  const form = useForm({
    defaultValues: {
      name: workspace.name,
    },
    validators: {
      onChange: updateNameSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateWorkspace({
          workspaceSlug: workspace.slug,
          name: value.name.trim(),
        });
        toast.success("Workspace name updated");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update workspace name",
        );
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="name">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Workspace Name</FieldLabel>
                <FieldContent>
                  <Input
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
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

          <Field>
            <FieldLabel>Workspace Slug</FieldLabel>
            <FieldContent>
              <Input value={workspace.slug} disabled />
              <p className="text-muted-foreground mt-1 text-xs">
                The slug cannot be changed after creation
              </p>
            </FieldContent>
          </Field>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                disabled={!canSubmit}
                isLoading={form.state.isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}

function DangerZone({
  workspaceId,
  onDeleted,
}: {
  workspaceId: string;
  onDeleted: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteWorkspace = useMutation(api.workspaces.remove);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteWorkspace({ slug: workspaceId });
      toast.success("Workspace deleted");
      onDeleted();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete workspace",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Delete Workspace</p>
            <p className="text-muted-foreground text-sm">
              Permanently delete this workspace and all its data
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger
              render={() => (
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Workspace?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  workspace and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete Workspace"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
