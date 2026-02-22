import { type } from "arktype";

import type { ApplicationFormField, FileUploadValue } from "./types";

export function buildFormSchema(fields: ApplicationFormField[]) {
  const fieldResponsesSchema: Record<string, unknown> = {};

  for (const field of fields) {
    fieldResponsesSchema[field._id] = buildFieldSchema(field);
  }

  return type({
    applicantName: "string > 0",
    applicantEmail: "string.email",
    fieldResponses: type(fieldResponsesSchema),
  });
}

export function buildFieldSchema(field: ApplicationFormField) {
  switch (field.type) {
    case "text":
    case "textarea": {
      if (field.required) {
        if (field.min !== undefined && field.max !== undefined) {
          return type(`${field.min}<= string <= ${field.max}`);
        }
        if (field.min !== undefined) {
          return type(`string >= ${field.min}`);
        }
        if (field.max !== undefined) {
          return type(`0 < string <= ${field.max}`);
        }
        return type("string > 0");
      }

      if (field.min !== undefined && field.max !== undefined) {
        return type(`${field.min} <= string <= ${field.max}`).or("''");
      }
      if (field.min !== undefined) {
        return type(`string >= ${field.min}`).or("''");
      }
      if (field.max !== undefined) {
        return type(`string <= ${field.max}`).or("''");
      }
      return type("string").or("''");
    }

    case "number": {
      if (field.min !== undefined && field.max !== undefined) {
        const rangeType = type(`${field.min} <= number <= ${field.max}`);

        if (field.required) {
          return type("string|number")
            .pipe((val) => {
              if (typeof val === "number") return val;
              if (val === "") return undefined;
              const parsed = Number(val);
              return Number.isNaN(parsed) ? undefined : parsed;
            })
            .narrow((val): val is number => {
              if (val === undefined) return false;
              const result = rangeType(val);
              return !(result instanceof type.errors);
            });
        }
      } else if (field.min !== undefined) {
        const minType = type(`number >= ${field.min}`);

        if (field.required) {
          return type("string|number")
            .pipe((val) => {
              if (typeof val === "number") return val;
              if (val === "") return undefined;
              const parsed = Number(val);
              return Number.isNaN(parsed) ? undefined : parsed;
            })
            .narrow((val): val is number => {
              if (val === undefined) return false;
              const result = minType(val);
              return !(result instanceof type.errors);
            });
        }
      } else if (field.max !== undefined) {
        const maxType = type(`number <= ${field.max}`);

        if (field.required) {
          return type("string|number")
            .pipe((val) => {
              if (typeof val === "number") return val;
              if (val === "") return undefined;
              const parsed = Number(val);
              return Number.isNaN(parsed) ? undefined : parsed;
            })
            .narrow((val): val is number => {
              if (val === undefined) return false;
              const result = maxType(val);
              return !(result instanceof type.errors);
            });
        }
      } else if (field.required) {
        return type("string|number")
          .pipe((val) => {
            if (typeof val === "number") return val;
            if (val === "") return undefined;
            const parsed = Number(val);
            return Number.isNaN(parsed) ? undefined : parsed;
          })
          .narrow((val): val is number => val !== undefined);
      }

      return type("string|number|undefined").pipe((val) => {
        if (val === undefined || val === "") return undefined;
        if (typeof val === "number") return val;
        const parsed = Number(val);
        return Number.isNaN(parsed) ? undefined : parsed;
      });
    }

    case "select": {
      const options = field.options ?? [];

      if (options.length > 0) {
        const enumType = type.enumerated(...options);
        return field.required ? enumType : enumType.or("''");
      }

      return field.required ? type("string>0") : type("string").or("''");
    }

    case "multiselect": {
      if (field.required) {
        return type("string[]>=1");
      }
      return type("string[]");
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
        return fileSchema.narrow(
          (val): val is FileUploadValue => val.files.length > 0,
        );
      }

      return fileSchema.or("undefined");
    }

    default:
      return type("string").or("undefined");
  }
}
