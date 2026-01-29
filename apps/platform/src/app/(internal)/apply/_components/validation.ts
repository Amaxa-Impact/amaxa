import type { Type } from "arktype";
import { type } from "arktype";
import { Result } from "better-result";

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
      // HTML inputs return strings, so we need to parse them
      const parseNumber = type("string | number").pipe((val) => {
        if (typeof val === "number") return val;
        if (val === "") return undefined;
        const parsed = Number(val);
        if (Number.isNaN(parsed)) return undefined;
        return parsed;
      });

      let numberValidator = type("number");
      if (field.min !== undefined) {
        numberValidator = type(`number >= ${field.min}`);
      }
      if (field.max !== undefined) {
        numberValidator = type(`number <= ${field.max}`);
      }

      if (field.required) {
        validator = parseNumber.pipe((val) => {
          if (val === undefined) {
            return numberValidator(undefined as never);
          }
          return numberValidator(val);
        });
      } else {
        validator = parseNumber.pipe((val) => {
          if (val === undefined) return val;
          return numberValidator(val);
        });
      }
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

    case "file": {
      const fileSchema = type({
        type: "'file'",
        files: type({
          blobId: "string",
          path: "string",
          filename: "string",
          contentType: "string",
          sizeBytes: "number",
        }).array(),
      });

      if (field.required) {
        validator = fileSchema.narrow((val) => val.files.length > 0);
      } else {
        validator = fileSchema.or("undefined");
      }
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
): Result<unknown, string> {
  const validator = createFieldValidator(field);
  const result = validator(value);

  if (result instanceof type.errors) {
    return Result.err(result.summary);
  }

  return Result.ok(result);
}
