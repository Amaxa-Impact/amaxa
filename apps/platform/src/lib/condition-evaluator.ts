import type { Id } from "@amaxa/backend/_generated/dataModel";

export interface Condition {
  sourceFieldId: Id<"applicationFormFields">;
  operator: "equals" | "notEquals" | "contains";
  value: string | string[];
}

export type FormValues = {
  fieldResponses?: Record<string, unknown>;
} & Record<string, unknown>;

/**
 * Evaluates a condition against current form values.
 * Returns true if the condition is met (field/section should be visible).
 */
export function evaluateCondition(
  condition: Condition | undefined,
  formValues: FormValues,
  fieldIdMap: Record<Id<"applicationFormFields">, string>,
): boolean {
  if (!condition) {
    return true;
  }

  const fieldKey = fieldIdMap[condition.sourceFieldId];
  if (!fieldKey) {
    return false;
  }

  const currentValue = getValueAtPath(formValues, fieldKey);
  const targetValue = condition.value;

  switch (condition.operator) {
    case "equals":
      return isEqual(currentValue, targetValue);

    case "notEquals":
      return !isEqual(currentValue, targetValue);

    case "contains":
      return containsValue(currentValue, targetValue);

    default:
      return false;
  }
}

function getValueAtPath(values: FormValues, path: string): unknown {
  const segments = path.split(".");
  let current: unknown = values;

  for (const segment of segments) {
    if (!current || typeof current !== "object") return undefined;
    const record = current as Record<string, unknown>;
    current = record[segment];
  }

  return current;
}

function isEqual(
  currentValue: unknown,
  targetValue: string | string[],
): boolean {
  if (currentValue === null || currentValue === undefined) {
    if (
      targetValue === "" ||
      (Array.isArray(targetValue) && targetValue.length === 0)
    ) {
      return true;
    }
    return false;
  }

  if (Array.isArray(currentValue) && Array.isArray(targetValue)) {
    if (currentValue.length !== targetValue.length) {
      return false;
    }
    const sortedCurrent = (currentValue as unknown[]).slice().sort();
    const sortedTarget = [...targetValue].sort();
    return sortedCurrent.every((val, i) => val === sortedTarget[i]);
  }

  if (Array.isArray(currentValue) && typeof targetValue === "string") {
    return currentValue.length === 1 && currentValue[0] === targetValue;
  }

  if (typeof currentValue === "string" && Array.isArray(targetValue)) {
    return targetValue.length === 1 && targetValue[0] === currentValue;
  }

  if (typeof currentValue === "string" && typeof targetValue === "string") {
    return currentValue === targetValue;
  }

  return false;
}

function containsValue(
  currentValue: unknown,
  targetValue: string | string[],
): boolean {
  if (currentValue === null || currentValue === undefined) {
    return false;
  }

  if (Array.isArray(currentValue)) {
    if (Array.isArray(targetValue)) {
      return targetValue.some((t) => currentValue.includes(t));
    }
    return currentValue.includes(targetValue);
  }

  if (typeof currentValue === "string") {
    if (Array.isArray(targetValue)) {
      return targetValue.includes(currentValue);
    }
    return currentValue === targetValue;
  }

  return false;
}

/**
 * Creates a field ID to form key mapping from fields array.
 */
export function createFieldIdMap(
  fields: { _id: Id<"applicationFormFields">; order: number }[],
): Record<Id<"applicationFormFields">, string> {
  const map: Record<Id<"applicationFormFields">, string> = {} as Record<
    Id<"applicationFormFields">,
    string
  >;
  for (const field of fields) {
    map[field._id] = `fieldResponses.${field._id}`;
  }
  return map;
}
