import type { Id } from "@amaxa/backend/_generated/dataModel";

export const FIELD_TYPES = [
  "text",
  "textarea",
  "number",
  "select",
  "multiselect",
  "file",
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export interface FileConfig {
  maxSizeBytes: number;
  allowedMimeTypes: string[];
  maxFiles?: number;
}

export type ConditionOperator = "equals" | "notEquals" | "contains";

export interface FieldCondition {
  sourceFieldId: Id<"applicationFormFields">;
  operator: ConditionOperator;
  value: string | string[];
}

export interface ApplicationFormField {
  _id: Id<"applicationFormFields">;
  _creationTime: number;
  formId: Id<"applicationForms">;
  sectionId?: Id<"applicationFormSections">;
  label: string;
  description?: string;
  type: FieldType;
  required: boolean;
  order: number;
  options?: string[];
  min?: number;
  max?: number;
  fileConfig?: FileConfig;
  condition?: FieldCondition;
}

export interface ApplicationFormSection {
  _id: Id<"applicationFormSections">;
  _creationTime: number;
  formId: Id<"applicationForms">;
  title: string;
  description?: string;
  order: number;
  condition?: FieldCondition;
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

export interface FileUploadValue {
  type: "file";
  files: Array<{
    s3Key: string;
    filename: string;
    contentType: string;
    sizeBytes: number;
  }>;
}

export interface FieldResponse {
  fieldId: Id<"applicationFormFields">;
  value: string | string[] | FileUploadValue;
}

export interface ApplyFormValues {
  applicantName: string;
  applicantEmail: string;
  fieldResponses: Record<string, string | string[] | FileUploadValue>;
}
