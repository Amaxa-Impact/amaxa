import { type } from "arktype";

export const contactFormSchema = type({
  name: "string",
  email: "string.email",
  message: "string",
  formType: type.enumerated("internship", "high-school", "general", "demo"),
  // Organization is required for demo requests, but optional for general inquiries
  organization: "string | undefined",
  phone: "string | undefined",
  preferredDate: "string | undefined",
  preferredTime: "string | undefined",
  timezone: "string | undefined",
});

export type ContactFormData = typeof contactFormSchema.infer;

export type FormType = ContactFormData["formType"];

export const formTypeLabels: Record<FormType, string> = {
  internship: "Internship Inquiry",
  "high-school": "High School Program Inquiry",
  general: "General Inquiry",
  demo: "Demo/Intro Call Request",
};
