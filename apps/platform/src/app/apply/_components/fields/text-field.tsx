"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import { Input } from "@amaxa/ui/input";
import { Label } from "@amaxa/ui/label";
import type { ApplicationFormField } from "../types";

interface TextFieldProps {
  field: AnyFieldApi;
  formField: ApplicationFormField;
}

export function TextField({ field, formField }: TextFieldProps) {
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <div className="space-y-2">
      <Label className="font-medium text-sm" htmlFor={field.name}>
        {formField.label}
        {formField.required && <span className="ml-1 text-destructive">*</span>}
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
        value={field.state.value ?? ""}
      />
      {hasError && (
        <p className="text-destructive text-xs">
          {field.state.meta.errors.join(", ")}
        </p>
      )}
    </div>
  );
}
