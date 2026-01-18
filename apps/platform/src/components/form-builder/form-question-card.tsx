"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { omitUndefined } from "@/lib/omit-undefined";
import { IconCopy, IconGripVertical, IconTrash } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "@amaxa/backend/_generated/api";
import { cn } from "@amaxa/ui";
import { Button } from "@amaxa/ui/button";
import { Field, FieldError, FieldLabel } from "@amaxa/ui/field";
import { Input } from "@amaxa/ui/input";
import { Switch } from "@amaxa/ui/switch";

import type { FormField, QuestionFormValues } from "./types";
import { FileConfigEditor } from "./file-config-editor";
import { FormFieldTypeSelector } from "./form-field-type-selector";
import { FormQuestionOptions } from "./form-question-options";
import { DEFAULT_FILE_CONFIG } from "./types";
import { useFieldTypeInference } from "./use-field-type-inference";

interface FormQuestionCardProps {
  field: FormField;
  isActive: boolean;
  onActivate: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function FormQuestionCard({
  field,
  isActive,
  onActivate,
  onDelete,
  onDuplicate,
  dragHandleProps,
}: FormQuestionCardProps) {
  const updateField = useMutation(api.applicationFormFields.update);
  const [isSaving, setIsSaving] = useState(false);
  const [typeManuallyChanged, setTypeManuallyChanged] = useState(false);
  const [suggestedOptions, setSuggestedOptions] = useState<
    string[] | undefined
  >(undefined);
  const labelInputRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { inferFieldType, isInferring } = useFieldTypeInference();

  const form = useForm({
    defaultValues: {
      label: field.label,
      description: field.description ?? "",
      type: field.type,
      required: field.required,
      options: field.options ?? [],
      min: field.min,
      max: field.max,
      fileConfig: field.fileConfig ?? DEFAULT_FILE_CONFIG,
    },
  });

  const saveField = useCallback(
    async (values: QuestionFormValues) => {
      setIsSaving(true);
      try {
        await updateField(
          omitUndefined({
            fieldId: field._id,
            label: values.label,
            description: values.description ?? undefined,
            type: values.type,
            required: values.required,
            options:
              values.type === "select" || values.type === "multiselect"
                ? values.options
                : undefined,
            min: values.type === "number" ? values.min : undefined,
            max: values.type === "number" ? values.max : undefined,
            fileConfig: values.type === "file" ? values.fileConfig : undefined,
          }),
        );
      } catch {
        toast.error("Failed to save changes");
      } finally {
        setIsSaving(false);
      }
    },
    [field._id, updateField],
  );

  const debouncedSave = useCallback(
    (values: QuestionFormValues) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        void saveField(values);
      }, 500);
    },
    [saveField],
  );

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleLabelBlur = useCallback(async () => {
    if (typeManuallyChanged) {
      return;
    }

    const label = form.getFieldValue("label");
    if (label && label.length > 3) {
      const result = await inferFieldType(label);
      if (result) {
        form.setFieldValue("type", result.fieldType);
        // Set suggested options if available
        if (result.suggestedOptions && result.suggestedOptions.length > 0) {
          setSuggestedOptions(result.suggestedOptions);
        }
        debouncedSave(
          omitUndefined({
            ...form.state.values,
            type: result.fieldType,
          }),
        );
      }
    }
  }, [form, inferFieldType, debouncedSave, typeManuallyChanged]);

  useEffect(() => {
    if (isActive && labelInputRef.current) {
      labelInputRef.current.focus();
    }
  }, [isActive]);

  const showOptions =
    form.state.values.type === "select" ||
    form.state.values.type === "multiselect";

  const showNumberConfig = form.state.values.type === "number";

  const showFileConfig = form.state.values.type === "file";

  return (
    <div
      className={cn(
        "group bg-card relative rounded-lg border transition-all",
        isActive
          ? "border-primary ring-primary/20 ring-1"
          : "border-border hover:border-muted-foreground/30",
      )}
      onClick={onActivate}
    >
      <div
        {...dragHandleProps}
        className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-grab opacity-0 transition-opacity group-hover:opacity-100"
      >
        <IconGripVertical className="text-muted-foreground h-5 w-5" />
      </div>

      {isSaving && (
        <div className="text-muted-foreground absolute top-2 right-2 text-xs">
          Saving...
        </div>
      )}

      <div className="space-y-4 p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <form.Field
              children={(fieldApi) => (
                <Field>
                  <Input
                    className={cn(
                      "focus-visible:border-primary rounded-none border-0 border-b px-0 text-base font-medium focus-visible:ring-0",
                      isActive ? "border-b-2" : "",
                    )}
                    disabled={isInferring}
                    id={`field-${field._id}-label`}
                    name={fieldApi.name}
                    onBlur={() => {
                      fieldApi.handleBlur();
                      void handleLabelBlur();
                    }}
                    onChange={(e) => {
                      fieldApi.handleChange(e.target.value);
                      setTypeManuallyChanged(false);
                      debouncedSave(omitUndefined({ ...form.state.values }));
                    }}
                    placeholder="Question"
                    ref={labelInputRef}
                    value={fieldApi.state.value}
                  />
                  {fieldApi.state.meta.isTouched &&
                    !fieldApi.state.meta.isValid && (
                      <FieldError errors={fieldApi.state.meta.errors} />
                    )}
                </Field>
              )}
              name="label"
            />
          </div>
          <form.Field
            children={(fieldApi) => (
              <FormFieldTypeSelector
                disabled={isInferring}
                onChange={(value) => {
                  fieldApi.handleChange(value);
                  setTypeManuallyChanged(true);
                  setSuggestedOptions(undefined);
                  debouncedSave(
                    omitUndefined({
                      ...form.state.values,
                      type: value,
                    }),
                  );
                }}
                value={fieldApi.state.value}
              />
            )}
            name="type"
          />
        </div>

        {isActive && (
          <form.Field
            children={(fieldApi) => (
              <Field>
                <Input
                  className="text-muted-foreground text-sm"
                  id={`field-${field._id}-description`}
                  name={fieldApi.name}
                  onBlur={fieldApi.handleBlur}
                  onChange={(e) => {
                    fieldApi.handleChange(e.target.value);
                    debouncedSave(
                      omitUndefined({
                        ...form.state.values,
                        description: e.target.value,
                      }),
                    );
                  }}
                  placeholder="Description (optional)"
                  value={fieldApi.state.value}
                />
              </Field>
            )}
            name="description"
          />
        )}

        {showOptions && (
          <form.Field
            children={(fieldApi) => (
              <FormQuestionOptions
                onOptionsChange={(options) => {
                  fieldApi.setValue(options);
                  debouncedSave(
                    omitUndefined({
                      ...form.state.values,
                      options,
                    }),
                  );
                }}
                options={fieldApi.state.value}
                type={form.state.values.type as "select" | "multiselect"}
                suggestedOptions={suggestedOptions ?? []}
                onDismissSuggestions={() => setSuggestedOptions(undefined)}
              />
            )}
            mode="array"
            name="options"
          />
        )}

        {showNumberConfig && isActive && (
          <div className="flex gap-4">
            <form.Field
              children={(fieldApi) => (
                <Field className="flex-1">
                  <FieldLabel htmlFor={`field-${field._id}-min`}>
                    Minimum
                  </FieldLabel>
                  <Input
                    id={`field-${field._id}-min`}
                    onChange={(e) => {
                      const value = e.target.value
                        ? Number.parseFloat(e.target.value)
                        : undefined;
                      fieldApi.handleChange(value);
                      debouncedSave(
                        omitUndefined({
                          ...form.state.values,
                          min: value,
                        }),
                      );
                    }}
                    placeholder="No minimum"
                    type="number"
                    value={fieldApi.state.value ?? ""}
                  />
                </Field>
              )}
              name="min"
            />
            <form.Field
              children={(fieldApi) => (
                <Field className="flex-1">
                  <FieldLabel htmlFor={`field-${field._id}-max`}>
                    Maximum
                  </FieldLabel>
                  <Input
                    id={`field-${field._id}-max`}
                    onChange={(e) => {
                      const value = e.target.value
                        ? Number.parseFloat(e.target.value)
                        : undefined;
                      fieldApi.handleChange(value);
                      debouncedSave(
                        omitUndefined({
                          ...form.state.values,
                          max: value,
                        }),
                      );
                    }}
                    placeholder="No maximum"
                    type="number"
                    value={fieldApi.state.value ?? ""}
                  />
                </Field>
              )}
              name="max"
            />
          </div>
        )}

        {showFileConfig && isActive && (
          <form.Field
            children={(fieldApi) => (
              <FileConfigEditor
                value={fieldApi.state.value}
                onChange={(config) => {
                  fieldApi.handleChange(config);
                  debouncedSave(
                    omitUndefined({
                      ...form.state.values,
                      fileConfig: config,
                    }),
                  );
                }}
              />
            )}
            name="fileConfig"
          />
        )}

        <div className="flex items-center justify-between border-t pt-2">
          <form.Field
            children={(fieldApi) => (
              <Field orientation="horizontal">
                <FieldLabel
                  className="text-sm font-normal"
                  htmlFor={`field-${field._id}-required`}
                >
                  Required
                </FieldLabel>
                <Switch
                  checked={fieldApi.state.value}
                  id={`field-${field._id}-required`}
                  onCheckedChange={(checked) => {
                    fieldApi.handleChange(checked);
                    debouncedSave(
                      omitUndefined({
                        ...form.state.values,
                        required: checked,
                      }),
                    );
                  }}
                />
              </Field>
            )}
            name="required"
          />

          <div className="flex gap-1">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              size="icon-sm"
              title="Duplicate"
              type="button"
              variant="ghost"
            >
              <IconCopy className="h-4 w-4" />
            </Button>
            <Button
              className="text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              size="icon-sm"
              title="Delete"
              type="button"
              variant="ghost"
            >
              <IconTrash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
