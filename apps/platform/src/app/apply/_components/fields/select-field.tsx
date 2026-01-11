/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import type { AnyFieldApi } from "@tanstack/react-form";

import { Label } from "@amaxa/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amaxa/ui/select";

import type { ApplicationFormField } from "../types";

interface SelectFieldProps {
  field: AnyFieldApi;
  formField: ApplicationFormField;
}

export function SelectField({ field, formField }: SelectFieldProps) {
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const options = formField.options ?? [];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium" htmlFor={field.name}>
        {formField.label}
        {formField.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {formField.description && (
        <p className="text-muted-foreground text-xs">{formField.description}</p>
      )}
      <Select
        onValueChange={(value) => {
          field.handleChange(value);
          field.handleBlur();
        }}
        value={field.state.value ?? ""}
      >
        <SelectTrigger aria-invalid={hasError} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError && (
        <p className="text-destructive text-xs">
          {field.state.meta.errors.join(", ")}
        </p>
      )}
    </div>
  );
}
