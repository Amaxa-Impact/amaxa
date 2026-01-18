"use client";

import type {
  Condition,
  FormValues as ConditionFormValues,
} from "@/lib/condition-evaluator";
import { useMemo, useState } from "react";
import { evaluateCondition } from "@/lib/condition-evaluator";
import { IconCheck, IconLoader2, IconSend } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { useStore } from "@tanstack/react-store";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import type { Id } from "@amaxa/backend/_generated/dataModel";
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
  ApplicationFormSection,
  FieldResponse,
  FileUploadValue,
} from "./types";
import { FormFieldRenderer } from "./form-field-renderer";
import { buildFieldSchema } from "./form-schema";

interface ApplyFormProps {
  form: ApplicationForm;
  fields: ApplicationFormField[];
  sections?: ApplicationFormSection[];
  slug: string;
}

export function ApplyForm({ form, fields, sections, slug }: ApplyFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { user } = useAuth();
  const submitApplication = useMutation(api.applicationResponses.submit);

  const fieldIdMap = useMemo(() => {
    const map: Record<Id<"applicationFormFields">, string> = {} as Record<
      Id<"applicationFormFields">,
      string
    >;
    fields.forEach((field) => {
      map[field._id] = `fieldResponses.${field._id}`;
    });
    return map;
  }, [fields]);

  const getDefaultValue = (
    field: ApplicationFormField,
  ): string | string[] | undefined => {
    if (field.type === "multiselect") return [];
    if (field.type === "file") return undefined;
    return "";
  };

  const tanstackForm = useForm({
    defaultValues: {
      applicantName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`,
      applicantEmail: `${user?.email ?? ""}`,
      fieldResponses: Object.fromEntries(
        fields.map((field) => [field._id, getDefaultValue(field)]),
      ),
    },
    onSubmit: async ({ value }) => {
      const visibleFields = fields.filter((field) => {
        if (field.sectionId && sections) {
          const section = sections.find((s) => s._id === field.sectionId);
          if (
            section?.condition &&
            !evaluateCondition(
              section.condition as Condition,
              value as ConditionFormValues,
              fieldIdMap,
            )
          ) {
            return false;
          }
        }
        if (field.condition) {
          return evaluateCondition(
            field.condition as Condition,
            value as ConditionFormValues,
            fieldIdMap,
          );
        }
        return true;
      });

      const fieldResponses: FieldResponse[] = visibleFields.map((field) => {
        const fieldValue = value.fieldResponses[field._id];

        return {
          fieldId: field._id,
          value: fieldValue as string | string[] | FileUploadValue,
        };
      });

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

  // Compute visibility for sections and fields based on current form values
  const formValues = useStore(tanstackForm.store, (state) => state.values);

  const isFieldVisible = (field: ApplicationFormField): boolean => {
    // Check if field's section is visible
    if (field.sectionId && sections) {
      const section = sections.find((s) => s._id === field.sectionId);
      if (
        section?.condition &&
        !evaluateCondition(
          section.condition as Condition,
          formValues as ConditionFormValues,
          fieldIdMap,
        )
      ) {
        return false;
      }
    }
    // Check if field itself is visible
    if (field.condition) {
      return evaluateCondition(
        field.condition as Condition,
        formValues as ConditionFormValues,
        fieldIdMap,
      );
    }
    return true;
  };

  const isSectionVisible = (section: ApplicationFormSection): boolean => {
    if (!section.condition) return true;
    return evaluateCondition(
      section.condition as Condition,
      formValues as ConditionFormValues,
      fieldIdMap,
    );
  };

  // Group fields by section
  const fieldsBySection = useMemo(() => {
    const grouped: Record<
      Id<"applicationFormSections"> | "unsectioned",
      ApplicationFormField[]
    > = {
      unsectioned: [],
    };

    sections?.forEach((s) => {
      grouped[s._id] = [];
    });

    fields.forEach((field) => {
      if (field.sectionId) {
        const section = grouped[field.sectionId];
        if (section) {
          section.push(field);
        } else {
          grouped.unsectioned.push(field);
        }
      } else {
        grouped.unsectioned.push(field);
      }
    });

    return grouped;
  }, [fields, sections]);

  const hasSections = sections && sections.length > 0;

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

  const renderField = (formField: ApplicationFormField) => {
    const visible = isFieldVisible(formField);

    if (!visible) return null;

    return (
      <tanstackForm.Field
        children={(field) => (
          <FormFieldRenderer
            field={field}
            formField={formField}
            formSlug={slug}
          />
        )}
        key={formField._id}
        name={`fieldResponses.${formField._id}` as const}
        validators={{
          onChange: buildFieldSchema(formField),
        }}
      />
    );
  };

  const renderSection = (section: ApplicationFormSection) => {
    if (!isSectionVisible(section)) return null;

    const sectionFields = fieldsBySection[section._id] ?? [];
    if (sectionFields.length === 0) return null;

    return (
      <div key={section._id} className="space-y-6">
        <div className="border-b pb-2">
          <h3 className="text-base font-semibold">{section.title}</h3>
          {section.description && (
            <p className="text-muted-foreground text-sm">
              {section.description}
            </p>
          )}
        </div>
        <div className="space-y-6">
          {sectionFields.map((formField) => renderField(formField))}
        </div>
      </div>
    );
  };

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
            <div className="space-y-8">
              <h3 className="text-muted-foreground text-sm font-medium">
                Application Questions
              </h3>

              {/* Render sections if they exist */}
              {hasSections && (
                <div className="space-y-8">
                  {sections.map((section) => renderSection(section))}
                </div>
              )}

              {/* Render unsectioned fields */}
              {fieldsBySection.unsectioned.length > 0 && (
                <div className="space-y-6">
                  {fieldsBySection.unsectioned.map((formField) =>
                    renderField(formField),
                  )}
                </div>
              )}

              {/* Fallback for forms without sections */}
              {!hasSections && fieldsBySection.unsectioned.length === 0 && (
                <div className="space-y-6">
                  {fields.map((formField) => renderField(formField))}
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <tanstackForm.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting] as const}
            children={(values) => {
              const [canSubmit, isSubmitting] = values;
              return (
                <div className="flex justify-end border-t pt-6">
                  <Button
                    className="min-w-32"
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
              );
            }}
          />
        </form>
      </CardContent>
    </Card>
  );
}
