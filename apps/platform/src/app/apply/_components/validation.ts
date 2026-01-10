import { z } from "zod";
import type { ApplicationFormField } from "./types";

export function createFieldValidator(field: ApplicationFormField) {
  let validator: z.ZodTypeAny;

  switch (field.type) {
    case "text":
    case "textarea": {
      let schema = z.string();
      if (field.required) {
        schema = schema.min(1, `${field.label} is required`);
      }
      if (field.min !== undefined) {
        schema = schema.min(
          field.min,
          `${field.label} must be at least ${field.min} characters`
        );
      }
      if (field.max !== undefined) {
        schema = schema.max(
          field.max,
          `${field.label} must be at most ${field.max} characters`
        );
      }
      validator = field.required ? schema : schema.optional();
      break;
    }

    case "number": {
      let schema = z.coerce.number();
      if (field.min !== undefined) {
        schema = schema.min(
          field.min,
          `${field.label} must be at least ${field.min}`
        );
      }
      if (field.max !== undefined) {
        schema = schema.max(
          field.max,
          `${field.label} must be at most ${field.max}`
        );
      }
      if (field.required) {
        validator = schema;
      } else {
        validator = schema.optional().or(z.literal(""));
      }
      break;
    }

    case "select": {
      const options = field.options ?? [];
      let schema = z.string();
      if (options.length > 0) {
        schema = z.enum(options as [string, ...string[]]);
      }
      if (field.required) {
        validator = schema.refine((val) => val.length > 0, {
          message: `${field.label} is required`,
        });
      } else {
        validator = schema.optional();
      }
      break;
    }

    case "multiselect": {
      let schema = z.array(z.string());
      if (field.required) {
        schema = schema.min(
          1,
          `Please select at least one option for ${field.label}`
        );
      }
      validator = schema;
      break;
    }

    default:
      validator = z.string().optional();
  }

  return validator;
}

export const applicantInfoSchema = z.object({
  applicantName: z.string().min(1, "Name is required"),
  applicantEmail: z.string().email("Please enter a valid email address"),
});

export function validateFieldValue(
  field: ApplicationFormField,
  value: string | string[] | undefined
): string | undefined {
  const validator = createFieldValidator(field);
  const result = validator.safeParse(value);

  if (!result.success) {
    return result.error.errors[0]?.message;
  }

  return undefined;
}
