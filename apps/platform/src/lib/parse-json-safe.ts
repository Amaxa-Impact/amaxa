import type { Type } from "arktype";
import { type } from "arktype";
import { Result } from "better-result";

import { JsonParseError, ValidationError } from "./errors";

export const parseJson = <T>(
  validator: Type<T>,
  input: unknown,
): Result<T, JsonParseError | ValidationError> => {
  return Result.try({
    try: () => {
      const value =
        typeof input === "string" ? (JSON.parse(input) as unknown) : input;

      const validated = validator(value);
      if (validated instanceof type.errors) {
        throw new ValidationError({
          message: `Validation failed: ${validated.summary}`,
          errors: validated.summary,
          input: value,
        });
      }

      return validated as T;
    },
    catch: (err) => {
      if (err instanceof ValidationError) {
        return err;
      }
      if (err instanceof Error && err.name === "SyntaxError") {
        return new JsonParseError({
          message: `JSON parse error: ${err.message}`,
          input,
          cause: err,
        });
      }
      return new JsonParseError({
        message: err instanceof Error ? err.message : "Unknown parsing error",
        input,
        cause: err,
      });
    },
  });
};
