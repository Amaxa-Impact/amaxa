import type { Type } from "arktype";
import { type } from "arktype";

import type { ApplicationFormField } from "./types";

export function createFieldValidator(field: ApplicationFormField) {
  let validator: Type;

  switch (field.type) {
    case "text":
    case "textarea": {
      let schemaString = type("string");
      if (field.required) schemaString = type("string > 0");
      if (field.min !== undefined)
        schemaString = type(`string >= ${field.min}`);
      if (field.max !== undefined)
        schemaString = type(`string <= ${field.max}`);

      const schema = type(schemaString);
      validator = field.required ? schema : schema.or("undefined|''");
      break;
    }

    case "number": {
      let schemaString = type("number");
      if (field.min !== undefined)
        schemaString = type(`number >= ${field.min}`);
      if (field.max !== undefined)
        schemaString = type(`number <= ${field.max}`);

      const schema = type(schemaString);
      validator = field.required
        ? schema
        : schema
            .or("undefined|''")
            .pipe((val) => (val === "" ? undefined : val));
      break;
    }

    case "select": {
      const options = field.options ?? [];

      const schema =
        options.length > 0 ? type.enumerated(...options) : type("string");

      validator = field.required ? schema : schema.or("undefined|''");
      break;
    }

    case "multiselect": {
      let schema = type("string[]");
      if (field.required) {
        schema = type("string[] >= 1");
      }
      validator = schema;
      break;
    }

    default:
      validator = type("string|undefined");
  }

  return validator;
}

export const applicantInfoSchema = type({
  applicantName: "string > 0",
  applicantEmail: "string.email",
});

export function validateFieldValue(
  field: ApplicationFormField,
  value: unknown,
): string | undefined {
  const validator = createFieldValidator(field);
  const result = validator(value);

  if (result instanceof type.errors) {
    return result.summary;
  }

  return undefined;
}
