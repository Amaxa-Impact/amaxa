"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      <Label className="font-medium text-sm" htmlFor={field.name}>
        {formField.label}
        {formField.required && <span className="ml-1 text-destructive">*</span>}
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
