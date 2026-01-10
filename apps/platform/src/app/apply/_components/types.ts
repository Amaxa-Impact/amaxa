import type { Id } from "@/convex/_generated/dataModel";

export const FIELD_TYPES = [
  "text",
  "textarea",
  "number",
  "select",
  "multiselect",
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export interface ApplicationFormField {
  _id: Id<"applicationFormFields">;
  _creationTime: number;
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

export interface ApplicationForm {
  _id: Id<"applicationForms">;
  _creationTime: number;
  title: string;
  description?: string;
  isPublished: boolean;
  slug: string;
  createdBy: string;
}

export interface FieldResponse {
  fieldId: Id<"applicationFormFields">;
  value: string | string[];
}

export interface ApplyFormValues {
  applicantName: string;
  applicantEmail: string;
  fieldResponses: Record<string, string | string[]>;
}
