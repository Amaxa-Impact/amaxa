/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import type { AnyFieldApi } from "@tanstack/react-form";

import { Input } from "@amaxa/ui/input";
import { Label } from "@amaxa/ui/label";

import type { ApplicationFormField } from "../types";

interface NumberFieldProps {
  field: AnyFieldApi;
  formField: ApplicationFormField;
}

export function NumberField({ field, formField }: NumberFieldProps) {
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
        max={formField.max}
        min={formField.min}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={`Enter ${formField.label.toLowerCase()}`}
        type="number"
        value={field.state.value ?? ""}
      />
      {(formField.min !== undefined || formField.max !== undefined) && (
        <p className="text-muted-foreground text-xs">
          {formField.min !== undefined && formField.max !== undefined
            ? `Range: ${formField.min} - ${formField.max}`
            : formField.min !== undefined
              ? `Minimum: ${formField.min}`
              : `Maximum: ${formField.max}`}
        </p>
      )}
      {hasError && (
        <p className="text-destructive text-xs">
          {field.state.meta.errors.join(", ")}
        </p>
      )}
    </div>
  );
}
