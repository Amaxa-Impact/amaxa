"use client";

import { useCallback, useRef, useState } from "react";
import { omitUndefined } from "@/lib/omit-undefined";
import { parseJson } from "@/lib/parse-json-safe";
import { type } from "arktype";
import { Result } from "better-result";

import type { FieldTypeInferenceResult } from "./types";
import { fieldTypeSchema } from "./types";

interface UseFieldTypeInferenceOptions {
  debounceMs?: number;
}
const responseValidator = type({
  fieldType: fieldTypeSchema,
  reasoning: "string | undefined ",
  suggestedOptions: "string[] | undefined",
});

export function useFieldTypeInference(
  options: UseFieldTypeInferenceOptions = {},
) {
  const { debounceMs = 300 } = options;
  const [isInferring, setIsInferring] = useState(false);
  const [lastResult, setLastResult] = useState<FieldTypeInferenceResult | null>(
    null,
  );
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const inferFieldType = useCallback(
    async (questionText: string): Promise<FieldTypeInferenceResult | null> => {
      // cancel in-flight work
      abortControllerRef.current?.abort();
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      if (!questionText || questionText.trim().length < 3) {
        return null;
      }

      return new Promise<FieldTypeInferenceResult | null>((resolve) => {
        debounceTimeoutRef.current = setTimeout(() => {
          void (async () => {
            setIsInferring(true);
            abortControllerRef.current = new AbortController();

            const result = await Result.gen(async function* () {
              const response = yield* Result.await(
                Result.tryPromise(() =>
                  fetch("/api/field-type", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ input: questionText.trim() }),
                    signal: abortControllerRef.current?.signal ?? null,
                  }),
                ),
              );

              if (!response.ok) {
                return Result.err(new Error("Failed to infer field type"));
              }

              const json = yield* Result.await(
                Result.tryPromise(() => response.json() as Promise<unknown>),
              );

              const parsed = parseJson(responseValidator, json);

              if (Result.isError(parsed)) {
                console.error(parsed.error);
                return Result.err(parsed.error);
              }

              return Result.ok(parsed.value);
            });

            result.match({
              ok: (data) => {
                const finalResult: FieldTypeInferenceResult = omitUndefined({
                  fieldType: data.fieldType,
                  reasoning: data.reasoning ?? "",
                  suggestedOptions: data.suggestedOptions,
                });

                setLastResult(finalResult);
                resolve(finalResult);
              },
              err: (error) => {
                if ((error as Error).name !== "AbortError") {
                  console.error("Field type inference error:", error);
                }
                resolve(null);
              },
            });

            setIsInferring(false);
          })();
        }, debounceMs);
      });
    },
    [debounceMs],
  );
  const cancelInference = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    setIsInferring(false);
  }, []);

  return {
    inferFieldType,
    cancelInference,
    isInferring,
    lastResult,
  };
}
