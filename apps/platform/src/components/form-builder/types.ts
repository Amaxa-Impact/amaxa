import { z } from "zod";

import type { Id } from "@amaxa/backend/_generated/dataModel";

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

// TanStack Form field schema
export const questionFormSchema = z.object({
  label: z.string().min(1, "Question text is required"),
  description: z.string().optional(),
  type: z.enum(FIELD_TYPES),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
});

export type QuestionFormValues = z.infer<typeof questionFormSchema>;

// For AI field type inference
export interface FieldTypeInferenceResult {
  fieldType: FieldType;
  reasoning: string;
}
