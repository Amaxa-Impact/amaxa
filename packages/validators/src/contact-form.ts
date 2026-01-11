import { type } from "arktype";

export const contactFormSchema = type({
  name: "string",
  email: "string.email",
  message: "string",
  formType: "'internship' | 'high-school' | 'general' | 'demo'",
  organization: "string?.optional",
  phone: "string?.optional",
  preferredDate: "string?.optional",
  preferredTime: "string?.optional",
  timezone: "string?.optional",
});

export type ContactFormData = typeof contactFormSchema.infer;

export type FormType = ContactFormData["formType"];

export const formTypeLabels: Record<FormType, string> = {
  internship: "Internship Inquiry",
  "high-school": "High School Program Inquiry",
  general: "General Inquiry",
  demo: "Demo/Intro Call Request",
};

export const emailSchema = type({
  email: "string.email",
});
