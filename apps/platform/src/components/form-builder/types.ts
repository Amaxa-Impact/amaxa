import type { FunctionReturnType } from "convex/server";
import { type } from "arktype";

import type { api } from "@amaxa/backend/_generated/api";
import type { Id } from "@amaxa/backend/_generated/dataModel";

export const fieldTypeSchema = type(
  "'text' | 'textarea' | 'number' | 'select' | 'multiselect' | 'file'",
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
  "file",
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export const fieldTypeLabels: Record<FieldType, string> = {
  text: "Short Answer",
  textarea: "Paragraph",
  number: "Number",
  select: "Dropdown",
  multiselect: "Checkboxes",
  file: "File Upload",
};

export const fieldTypeIcons: Record<FieldType, string> = {
  text: "text-short",
  textarea: "align-left",
  number: "hash",
  select: "circle-dot",
  multiselect: "square-check",
  file: "upload",
};

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

export type FormSection = FunctionReturnType<
  typeof api.applicationFormSections.listByFormId
>[number];

export type FormField = FunctionReturnType<
  typeof api.applicationFormFields.listByFormId
>[number];

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
  fileConfig: type({
    maxSizeBytes: "number",
    allowedMimeTypes: "string[]",
    maxFiles: "number?",
  }).optional(),
});

export type QuestionFormValues = typeof questionFormSchema.infer;

// For AI field type inference
export interface FieldTypeInferenceResult {
  fieldType: FieldType;
  reasoning: string;
  suggestedOptions?: string[];
}

// Default file config values
export const DEFAULT_FILE_CONFIG: FileConfig = {
  maxSizeBytes: 5 * 1024 * 1024, // 5 MB
  allowedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  maxFiles: 1,
};

// Mime type presets for file config editor
export const MIME_TYPE_PRESETS = {
  images: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  documents: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  all: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
} as const;

// File size presets in bytes
export const FILE_SIZE_PRESETS = {
  "1 MB": 1 * 1024 * 1024,
  "5 MB": 5 * 1024 * 1024,
  "10 MB": 10 * 1024 * 1024,
  "25 MB": 25 * 1024 * 1024,
} as const;
