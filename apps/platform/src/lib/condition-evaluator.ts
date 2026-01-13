import type { Id } from "@amaxa/backend/convex/_generated/dataModel";

export interface Condition {
  sourceFieldId: Id<"applicationFormFields">;
  operator: "equals" | "notEquals" | "contains";
  value: string | string[];
}

export type FormValues = Record<string, unknown>;

/**
 * Evaluates a condition against current form values.
 * Returns true if the condition is met (field/section should be visible).
 */
export function evaluateCondition(
  condition: Condition | undefined,
  formValues: FormValues,
  fieldIdMap: Record<Id<"applicationFormFields">, string>
): boolean {
  // No condition means always visible
  if (!condition) {
    return true;
  }

  const fieldKey = fieldIdMap[condition.sourceFieldId];
  if (!fieldKey) {
    // Source field not found, default to hidden
    return false;
  }

  const currentValue = formValues[fieldKey];
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

/**
 * Checks if two values are equal.
 * Handles string, array, and null/undefined comparisons.
 */
function isEqual(
  currentValue: unknown,
  targetValue: string | string[]
): boolean {
  // Handle null/undefined/empty cases
  if (currentValue === null || currentValue === undefined) {
    // Empty value equals empty target
    if (targetValue === "" || (Array.isArray(targetValue) && targetValue.length === 0)) {
      return true;
    }
    return false;
  }

  // Both are arrays - compare as sets
  if (Array.isArray(currentValue) && Array.isArray(targetValue)) {
    if (currentValue.length !== targetValue.length) {
      return false;
    }
    const sortedCurrent = [...currentValue].sort();
    const sortedTarget = [...targetValue].sort();
    return sortedCurrent.every((val, i) => val === sortedTarget[i]);
  }

  // Current is array, target is string - check if array has single matching value
  if (Array.isArray(currentValue) && typeof targetValue === "string") {
    return currentValue.length === 1 && currentValue[0] === targetValue;
  }

  // Current is string, target is array - check if target has single matching value
  if (typeof currentValue === "string" && Array.isArray(targetValue)) {
    return targetValue.length === 1 && targetValue[0] === currentValue;
  }

  // Both are strings
  if (typeof currentValue === "string" && typeof targetValue === "string") {
    return currentValue === targetValue;
  }

  return false;
}

/**
 * Checks if current value contains the target value.
 * For multiselect fields - checks if any of the target values are selected.
 */
function containsValue(
  currentValue: unknown,
  targetValue: string | string[]
): boolean {
  // Handle null/undefined
  if (currentValue === null || currentValue === undefined) {
    return false;
  }

  // Current is array (multiselect)
  if (Array.isArray(currentValue)) {
    if (Array.isArray(targetValue)) {
      // Check if any target values are in current
      return targetValue.some((t) => currentValue.includes(t));
    }
    // Single target value
    return currentValue.includes(targetValue);
  }

  // Current is string
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
  fields: Array<{ _id: Id<"applicationFormFields">; order: number }>
): Record<Id<"applicationFormFields">, string> {
  const map: Record<Id<"applicationFormFields">, string> = {} as Record<
    Id<"applicationFormFields">,
    string
  >;
  for (const field of fields) {
    map[field._id] = `field_${field.order}`;
  }
  return map;
}
