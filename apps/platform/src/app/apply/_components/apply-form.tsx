/** biome-ignore-all lint/correctness/noChildrenProp: <explanation> */
"use client";

import { useState } from "react";
import { IconCheck, IconLoader2, IconSend } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "@amaxa/backend/_generated/api";
import { Button } from "@amaxa/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@amaxa/ui/card";
import { Input } from "@amaxa/ui/input";
import { Label } from "@amaxa/ui/label";

import type {
  ApplicationForm,
  ApplicationFormField,
  FieldResponse,
} from "./types";
import { FormFieldRenderer } from "./form-field-renderer";
import { validateFieldValue } from "./validation";

interface ApplyFormProps {
  form: ApplicationForm;
  fields: ApplicationFormField[];
}

export function ApplyForm({ form, fields }: ApplyFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const submitApplication = useMutation(api.applicationResponses.submit);

  const tanstackForm = useForm({
    defaultValues: {
      applicantName: "",
      applicantEmail: "",
      ...Object.fromEntries(
        fields.map((field) => [
          field._id,
          field.type === "multiselect" ? [] : "",
        ]),
      ),
    },
    onSubmit: async ({ value }) => {
      const fieldResponses: FieldResponse[] = fields.map((field) => ({
        fieldId: field._id,
        value: value[field._id] as string | string[],
      }));

      try {
        await submitApplication({
          formId: form._id,
          applicantName: value.applicantName,
          applicantEmail: value.applicantEmail,
          fieldResponses,
        });

        setIsSubmitted(true);
        toast.success("Application submitted successfully!");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to submit application",
        );
      }
    },
  });

  if (isSubmitted) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <IconCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">Application Submitted!</h2>
          <p className="text-muted-foreground">
            Thank you for your application. We&apos;ll review it and get back to
            you soon.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader className="border-b">
        <CardTitle className="text-xl">{form.title}</CardTitle>
        {form.description && (
          <CardDescription>{form.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void tanstackForm.handleSubmit();
          }}
        >
          <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
            <h3 className="text-muted-foreground text-sm font-medium">
              Your Information
            </h3>

            <tanstackForm.Field
              children={(field) => {
                const hasError =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0;
                return (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium" htmlFor={field.name}>
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      aria-invalid={hasError}
                      className="h-9"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter your full name"
                      value={field.state.value}
                    />
                    {hasError && (
                      <p className="text-destructive text-xs">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </div>
                );
              }}
              name="applicantName"
              validators={{
                onChange: ({ value }) =>
                  value ? undefined : "Name is required",
              }}
            />

            <tanstackForm.Field
              children={(field) => {
                const hasError =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0;
                return (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium" htmlFor={field.name}>
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      aria-invalid={hasError}
                      className="h-9"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter your email address"
                      type="email"
                      value={field.state.value}
                    />
                    {hasError && (
                      <p className="text-destructive text-xs">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </div>
                );
              }}
              name="applicantEmail"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Email is required";
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(value)) {
                    return "Please enter a valid email address";
                  }
                  return undefined;
                },
              }}
            />
          </div>

          {/* Dynamic Form Fields */}
          {fields.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-muted-foreground text-sm font-medium">
                Application Questions
              </h3>

              {fields.map((formField) => (
                <tanstackForm.Field
                  children={(field) => (
                    <FormFieldRenderer field={field} formField={formField} />
                  )}
                  key={formField._id}
                  name={formField._id}
                  validators={{
                    onChange: ({ value }) =>
                      validateFieldValue(formField, value as string | string[]),
                  }}
                />
              ))}
            </div>
          )}

          {/* Submit Button */}
          <tanstackForm.Subscribe
            children={([canSubmit, isSubmitting]) => (
              <div className="flex justify-end border-t pt-6">
                <Button
                  className="min-w-32"
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  disabled={!canSubmit || isSubmitting}
                  size="lg"
                  type="submit"
                >
                  {isSubmitting ? (
                    <>
                      <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <IconSend className="mr-2 h-4 w-4" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            )}
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          />
        </form>
      </CardContent>
    </Card>
  );
}
