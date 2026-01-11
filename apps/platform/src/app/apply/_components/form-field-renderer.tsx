"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import { memo } from "react";

import type { ApplicationFormField } from "./types";
import { MultiselectField } from "./fields/multiselect-field";
import { NumberField } from "./fields/number-field";
import { SelectField } from "./fields/select-field";
import { TextField } from "./fields/text-field";
import { TextareaField } from "./fields/textarea-field";

interface FormFieldRendererProps {
  field: AnyFieldApi;
  formField: ApplicationFormField;
}

function FormFieldRendererComponent({
  field,
  formField,
}: FormFieldRendererProps) {
  switch (formField.type) {
    case "text":
      return <TextField field={field} formField={formField} />;
    case "textarea":
      return <TextareaField field={field} formField={formField} />;
    case "number":
      return <NumberField field={field} formField={formField} />;
    case "select":
      return <SelectField field={field} formField={formField} />;
    case "multiselect":
      return <MultiselectField field={field} formField={formField} />;
    default:
      return <TextField field={field} formField={formField} />;
  }
}

export const FormFieldRenderer = memo(FormFieldRendererComponent);
