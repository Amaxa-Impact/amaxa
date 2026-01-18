import { type } from "arktype";
import { describe, expect, it } from "vitest";

import type { ApplicationFormField } from "./types";
import { buildFieldSchema, buildFormSchema } from "./form-schema";

const formId = "form" as ApplicationFormField["formId"];

const createField = (
  overrides: Partial<ApplicationFormField>,
): ApplicationFormField => ({
  _id: "field" as ApplicationFormField["_id"],
  _creationTime: 0,
  formId,
  label: "Field",
  type: "text",
  required: true,
  order: 0,
  ...overrides,
});

describe("buildFieldSchema", () => {
  it("validates required text fields", () => {
    const field = createField({ type: "text", required: true });
    const schema = buildFieldSchema(field);

    expect(schema("") instanceof type.errors).toBe(true);
    expect(schema("Hello") instanceof type.errors).toBe(false);
  });

  it("validates number fields with ranges", () => {
    const field = createField({
      type: "number",
      required: true,
      min: 1,
      max: 5,
    });
    const schema = buildFieldSchema(field);

    expect(schema("0") instanceof type.errors).toBe(true);
    expect(schema("3")).toBe(3);
  });
});

describe("buildFormSchema", () => {
  it("validates fieldResponses payload", () => {
    const field = createField({
      type: "text",
      _id: "field-1" as ApplicationFormField["_id"],
    });
    const schema = buildFormSchema([field]);

    const result = schema({
      applicantName: "Jane",
      applicantEmail: "jane@example.com",
      fieldResponses: {
        "field-1": "Answer",
      },
    });

    expect(result instanceof type.errors).toBe(false);
  });
});
