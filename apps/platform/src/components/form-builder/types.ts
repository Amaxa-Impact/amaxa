import { type } from "arktype";

import type { Id } from "@amaxa/backend/_generated/dataModel";

export const fieldTypeSchema = type(
  "'text' | 'textarea' | 'number' | 'select' | 'multiselect'",
);

export const inputSchema = type({
  input: "string",
});

export const FIELD_TYPES = [
  "text",
  "textarea",
  "number",
  "select",
  "multiselect",
] as const;
export type FieldType = (typeof FIELD_TYPES)[number];

export const fieldTypeLabels: Record<FieldType, string> = {
  text: "Short Answer",
  textarea: "Paragraph",
  number: "Number",
  select: "Dropdown",
  multiselect: "Checkboxes",
};

export const fieldTypeIcons: Record<FieldType, string> = {
  text: "text-short",
  textarea: "align-left",
  number: "hash",
  select: "circle-dot",
  multiselect: "square-check",
};

export interface FormField {
  _id: Id<"applicationFormFields">;
  formId: Id<"applicationForms">;
  label: string;
  description?: string;
  type: FieldType;
  required: boolean;
  order: number;
  options?: string[];
  min?: number;
  max?: number;
}

export interface FormData {
  _id?: Id<"applicationForms">;
  title: string;
  description: string | undefined;
  isPublished: boolean;
  slug: string;
  createdBy: string;
}

export const questionFormSchema = type({
  label: "string > 1",
  description: "string?",
  type: fieldTypeSchema,
  required: "boolean",
  options: "string[]?",
  min: "number?",
  max: "number?",
});

export type QuestionFormValues = typeof questionFormSchema.infer;

// For AI field type inference
export interface FieldTypeInferenceResult {
  fieldType: FieldType;
  reasoning: string;
}
