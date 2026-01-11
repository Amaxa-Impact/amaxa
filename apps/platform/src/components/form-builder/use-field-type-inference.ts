import { useCallback, useRef, useState } from "react";

import type { FieldType, FieldTypeInferenceResult } from "./types";

interface UseFieldTypeInferenceOptions {
  debounceMs?: number;
}

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
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      if (!questionText || questionText.trim().length < 3) {
        return null;
      }

      return new Promise((resolve) => {
        debounceTimeoutRef.current = setTimeout(async () => {
          setIsInferring(true);
          abortControllerRef.current = new AbortController();

          try {
            const response = await fetch("/api/field-type", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ input: questionText.trim() }),
              signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
              throw new Error("Failed to infer field type");
            }

            const data = await response.json();
            const result: FieldTypeInferenceResult = {
              fieldType: data.fieldType as FieldType,
              reasoning: data.reasoning || "",
            };

            setLastResult(result);
            resolve(result);
          } catch (error) {
            if ((error as Error).name === "AbortError") {
              resolve(null);
              return;
            }
            console.error("Field type inference error:", error);
            resolve(null);
          } finally {
            setIsInferring(false);
          }
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
