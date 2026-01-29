import { notFound } from "next/navigation";
import { env } from "@/env";

import type { Id } from "@amaxa/backend/_generated/dataModel";

import type {
  ApplicationForm,
  ApplicationFormField,
} from "../_components/types";
import { ApplyForm } from "../_components/apply-form";

const formId = "test-form" as Id<"applicationForms">;

const textFieldId = "field-short-answer" as Id<"applicationFormFields">;
const textareaFieldId = "field-long-answer" as Id<"applicationFormFields">;
const numberFieldId = "field-number" as Id<"applicationFormFields">;
const selectFieldId = "field-experience" as Id<"applicationFormFields">;
const conditionalFieldId =
  "field-experience-details" as Id<"applicationFormFields">;
const multiselectFieldId = "field-skills" as Id<"applicationFormFields">;
const fileFieldId = "field-resume" as Id<"applicationFormFields">;

const form: ApplicationForm = {
  _id: formId,
  _creationTime: 0,
  title: "Test Application Form",
  description: "E2E test form for custom field types",
  isPublished: true,
  slug: "test",
  createdBy: "test-user",
};

const fields: ApplicationFormField[] = [
  {
    _id: textFieldId,
    _creationTime: 0,
    formId,
    label: "Short Answer",
    description: "Required text input",
    type: "text",
    required: true,
    order: 0,
  },
  {
    _id: textareaFieldId,
    _creationTime: 0,
    formId,
    label: "Long Answer",
    description: "Optional long response",
    type: "textarea",
    required: false,
    order: 1,
    max: 140,
  },
  {
    _id: numberFieldId,
    _creationTime: 0,
    formId,
    label: "Number Input",
    description: "Number between 1 and 5",
    type: "number",
    required: true,
    order: 2,
    min: 1,
    max: 5,
  },
  {
    _id: selectFieldId,
    _creationTime: 0,
    formId,
    label: "Experience Level",
    description: "Choose one option",
    type: "select",
    required: true,
    order: 3,
    options: ["Yes", "No"],
  },
  {
    _id: conditionalFieldId,
    _creationTime: 0,
    formId,
    label: "Experience Details",
    description: "Shown when experience is Yes",
    type: "textarea",
    required: true,
    order: 4,
    condition: {
      sourceFieldId: selectFieldId,
      operator: "equals",
      value: "Yes",
    },
  },
  {
    _id: multiselectFieldId,
    _creationTime: 0,
    formId,
    label: "Skills",
    description: "Select all that apply",
    type: "multiselect",
    required: true,
    order: 5,
    options: ["TypeScript", "React", "Design"],
  },
  {
    _id: fileFieldId,
    _creationTime: 0,
    formId,
    label: "Resume",
    description: "Upload a PDF resume",
    type: "file",
    required: false,
    order: 6,
    fileConfig: {
      maxSizeBytes: 5 * 1024 * 1024,
      allowedMimeTypes: ["application/pdf"],
      maxFiles: 1,
    },
  },
];

export default function ApplyTestPage() {
  if (env.NODE_ENV !== "test" && env.E2E_TESTS_ENABLED !== "true") {
    notFound();
  }

  return (
    <div className="from-background to-muted/20 min-h-screen bg-linear-to-b py-8 md:py-12">
      <div className="container mx-auto px-4">
        <ApplyForm slug={form.slug} fields={fields} form={form} sections={[]} />
      </div>
    </div>
  );
}
