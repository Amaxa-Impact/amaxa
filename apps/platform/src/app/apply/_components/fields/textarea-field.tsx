"use client";

import { Label } from "@amaxa/ui/label";
import { Textarea } from "@amaxa/ui/textarea";

import type { ApplicationFormField } from "../types";

interface FormFieldApi<TValue> {
  name: string;
  state: {
    value: TValue;
    meta: {
      isTouched: boolean;
      errors: string[];
    };
  };
  handleBlur: () => void;
  handleChange: (value: TValue) => void;
}

interface TextareaFieldProps {
  field: FormFieldApi<string>;
  formField: ApplicationFormField;
}

export function TextareaField({ field, formField }: TextareaFieldProps) {
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const charCount = field.state.value.length;
  const showCharCount = formField.max !== undefined;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium" htmlFor={field.name}>
          {formField.label}
          {formField.required && (
            <span className="text-destructive ml-1">*</span>
          )}
        </Label>
        {showCharCount && (
          <span className="text-muted-foreground text-xs">
            {charCount}/{formField.max}
          </span>
        )}
      </div>
      {formField.description && (
        <p className="text-muted-foreground text-xs">{formField.description}</p>
      )}
      <Textarea
        aria-invalid={hasError}
        className="min-h-24 resize-y"
        id={field.name}
        maxLength={formField.max}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={`Enter ${formField.label.toLowerCase()}`}
        value={field.state.value}
      />
      {hasError && (
        <p className="text-destructive text-xs">
          {field.state.meta.errors.join(", ")}
        </p>
      )}
    </div>
  );
}
