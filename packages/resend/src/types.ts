import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
  formType: z.enum([
    "internship",
    "high-school",
    "general",
    "demo",
  ]),
  organization: z.string().optional(),
  phone: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  timezone: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export type FormType = ContactFormData["formType"];

export const formTypeLabels: Record<FormType, string> = {
  internship: "Internship Inquiry",
  "high-school": "High School Program Inquiry",
  general: "General Inquiry",
  demo: "Demo/Intro Call Request",
};
