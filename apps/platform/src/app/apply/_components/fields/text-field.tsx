"use client";

import { Input } from "@amaxa/ui/input";
import { Label } from "@amaxa/ui/label";

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

interface TextFieldProps {
  field: FormFieldApi<string>;
  formField: ApplicationFormField;
}

export function TextField({ field, formField }: TextFieldProps) {
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium" htmlFor={field.name}>
        {formField.label}
        {formField.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {formField.description && (
        <p className="text-muted-foreground text-xs">{formField.description}</p>
      )}
      <Input
        aria-invalid={hasError}
        className="h-9"
        id={field.name}
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
