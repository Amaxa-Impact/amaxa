import { type } from "arktype";

export const fieldTypeSchema = type(
  "'text' | 'textarea' | 'number' | 'select' | 'multiselect'",
);

export const inputSchema = type({
  input: "string",
});

export type InputData = typeof inputSchema.infer;

export const questionFormSchema = type({
  label: "string",
  description: "string?.optional",
  type: fieldTypeSchema,
  required: "boolean",
  options: "string[]?.optional",
  min: "number?.optional",
  max: "number?.optional",
});

export type QuestionFormData = typeof questionFormSchema.infer;

export const applicantInfoSchema = type({
  applicantName: "string",
  applicantEmail: "string.email",
});

export type ApplicantInfoData = typeof applicantInfoSchema.infer;
