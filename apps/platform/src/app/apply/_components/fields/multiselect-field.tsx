"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import { Checkbox } from "@amaxa/ui/checkbox";
import { Label } from "@amaxa/ui/label";
import type { ApplicationFormField } from "../types";

interface MultiselectFieldProps {
  field: AnyFieldApi;
  formField: ApplicationFormField;
}

export function MultiselectField({ field, formField }: MultiselectFieldProps) {
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const options = formField.options ?? [];
  const selectedValues: string[] = Array.isArray(field.state.value)
    ? field.state.value
    : [];

  const handleToggle = (option: string, checked: boolean) => {
    const newValues = checked
      ? [...selectedValues, option]
      : selectedValues.filter((v) => v !== option);
    field.handleChange(newValues);
  };

  return (
    <div className="space-y-3">
      <div>
        <Label className="font-medium text-sm">
          {formField.label}
          {formField.required && (
            <span className="ml-1 text-destructive">*</span>
          )}
        </Label>
        {formField.description && (
          <p className="mt-1 text-muted-foreground text-xs">
            {formField.description}
          </p>
        )}
      </div>
      <div className="space-y-2">
        {options.map((option) => {
          const isChecked = selectedValues.includes(option);
          const optionId = `${field.name}-${option}`;

          return (
            <div className="flex items-center gap-3" key={option}>
              <Checkbox
                checked={isChecked}
                id={optionId}
                onBlur={field.handleBlur}
                onCheckedChange={(checked) =>
                  handleToggle(option, checked === true)
                }
              />
              <Label
                className="cursor-pointer font-normal text-sm"
                htmlFor={optionId}
              >
                {option}
              </Label>
            </div>
          );
        })}
      </div>
      {hasError && (
        <p className="text-destructive text-xs">
          {field.state.meta.errors.join(", ")}
        </p>
      )}
    </div>
  );
}
