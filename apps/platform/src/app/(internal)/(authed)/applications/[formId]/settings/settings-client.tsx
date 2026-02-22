"use client";

import { useApplicationForm } from "@/components/application/context";
import { useForm } from "@tanstack/react-form";
import { type } from "arktype";
import { useMutation } from "convex/react";

import { api } from "@amaxa/backend/_generated/api";
import { Button } from "@amaxa/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@amaxa/ui/field";
import { Input } from "@amaxa/ui/input";
import { Switch } from "@amaxa/ui/switch";

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
export default function SettingsPageClient() {
  const applicationFormData = useApplicationForm();

  const mutation = useMutation(api.applicationForms.update);

  const form = useForm({
    defaultValues: {
      slug: applicationFormData.slug,
      isPublished: applicationFormData.isPublished,
    },
    validators: {
      onChange: type({
        slug: "string > 1",
        isPublished: "boolean",
      }),
    },
    onSubmit: async ({ value }) => {
      try {
        await sleep(1000);
        await mutation({
          formId: applicationFormData._id,
          slug: value.slug,
          isPublished: value.isPublished,
        });
      } catch (error) {
        console.error(error);
      }
    },
  });
  const { isSubmitting } = form.state;

  return (
    <main className="container mx-auto flex h-full flex-col p-4">
      <div id="application-form-settings">
        <FieldGroup>
          <form.Field name="slug">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>URL Slug</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  value={field.state.value}
                />
                <FieldDescription>
                  The URL slug for the application form.
                </FieldDescription>
              </Field>
            )}
          </form.Field>
          <form.Field name="isPublished">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field orientation="horizontal" data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="isPublished">Published</FieldLabel>
                    <FieldDescription>
                      Should this form be published?
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </FieldContent>
                  <Switch
                    id="isPublished"
                    name={field.name}
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                    aria-invalid={isInvalid}
                  />
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
        <Field orientation="horizontal">
          <Button
            onClick={() => void form.handleSubmit()}
            type="button"
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Saving…" : "Submit"}
          </Button>
        </Field>
      </div>
    </main>
  );
}
