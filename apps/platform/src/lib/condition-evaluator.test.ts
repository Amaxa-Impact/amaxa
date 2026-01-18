import { describe, expect, it } from "vitest";

import type { Id } from "@amaxa/backend/_generated/dataModel";

import { createFieldIdMap, evaluateCondition } from "./condition-evaluator";

const fieldId = "field-1" as Id<"applicationFormFields">;

describe("evaluateCondition", () => {
  it("checks equals against fieldResponses values", () => {
    const formValues = {
      fieldResponses: {
        [fieldId]: "Yes",
      },
    };

    const fieldIdMap = {
      [fieldId]: `fieldResponses.${fieldId}`,
    } as Record<Id<"applicationFormFields">, string>;

    const result = evaluateCondition(
      {
        sourceFieldId: fieldId,
        operator: "equals",
        value: "Yes",
      },
      formValues,
      fieldIdMap,
    );

    expect(result).toBe(true);
  });

  it("checks contains for multiselect values", () => {
    const formValues = {
      fieldResponses: {
        [fieldId]: ["TypeScript", "React"],
      },
    };

    const fieldIdMap = {
      [fieldId]: `fieldResponses.${fieldId}`,
    } as Record<Id<"applicationFormFields">, string>;

    const result = evaluateCondition(
      {
        sourceFieldId: fieldId,
        operator: "contains",
        value: "React",
      },
      formValues,
      fieldIdMap,
    );

    expect(result).toBe(true);
  });
});

describe("createFieldIdMap", () => {
  it("maps field ids to fieldResponses paths", () => {
    const result = createFieldIdMap([
      {
        _id: fieldId,
        order: 0,
      },
    ]);

    expect(result[fieldId]).toBe(`fieldResponses.${fieldId}`);
  });
});
