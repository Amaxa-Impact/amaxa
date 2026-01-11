"use client";

import type { User } from "@/lib/workos";
import { useEffect } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/kibo-ui/combobox";
import { UserDropdown } from "@/components/user-dropdown";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { z } from "zod";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";
import { Button } from "@amaxa/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@amaxa/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@amaxa/ui/field";

const formSchema = z.object({
  userId: z.string().min(1, "Please select a user."),
  role: z.enum(["coach", "member"], {
    message: "Please select a role.",
  }),
});

const roleOptions = [
  { label: "Member", value: "member" },
  { label: "Coach", value: "coach" },
];

export function AddUserForm({
  allUsers,
  projectId,
  open,
  onOpenChange,
  existingUserIds,
}: {
  allUsers: User;
  projectId: Id<"projects">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingUserIds?: string[];
}) {
  const assignUser = useMutation(api.userToProjects.assign);

  const form = useForm({
    defaultValues: {
      userId: "",
      role: "member" as "coach" | "member",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await assignUser({
          userId: value.userId,
          projectId,
          role: value.role,
        });
        toast.success("User added successfully", {
          description: `User has been added to the project as ${value.role}.`,
        });
        form.reset();
        onOpenChange(false);
      } catch (error) {
        toast.error("Failed to add user", {
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred.",
        });
      }
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add User to Project</DialogTitle>
          <DialogDescription>
            Select a user and assign them a role in this project.
          </DialogDescription>
        </DialogHeader>

        <form
          id="add-user-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="userId">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="add-user-form-userId">User</FieldLabel>
                    <UserDropdown
                      aria-invalid={isInvalid}
                      className="w-full"
                      emptyMessage="No users found."
                      excludeUserIds={existingUserIds}
                      id="add-user-form-userId"
                      onValueChange={field.handleChange}
                      placeholder="Search users..."
                      users={allUsers}
                      value={field.state.value}
                    />
                    <FieldDescription>
                      Search and select a user to add to this project.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="role">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="add-user-form-role">Role</FieldLabel>
                    <Combobox
                      data={roleOptions}
                      onValueChange={(value) =>
                        field.handleChange(value as "coach" | "member")
                      }
                      type="role"
                      value={field.state.value}
                    >
                      <ComboboxTrigger
                        aria-invalid={isInvalid}
                        className="w-full"
                        id="add-user-form-role"
                      />
                      <ComboboxContent>
                        <ComboboxInput placeholder="Search roles..." />
                        <ComboboxList>
                          <ComboboxEmpty>No roles found.</ComboboxEmpty>
                          <ComboboxGroup>
                            {roleOptions.map((role) => (
                              <ComboboxItem key={role.value} value={role.value}>
                                {role.label}
                              </ComboboxItem>
                            ))}
                          </ComboboxGroup>
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    <FieldDescription>
                      Choose the role for this user in the project.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            onClick={() => {
              form.reset();
              onOpenChange(false);
            }}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button form="add-user-form" type="submit">
            Add User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
