"use client";

import { useMemo } from "react";
import { IconX } from "@tabler/icons-react";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { Button } from "@amaxa/ui/button";
import { Field, FieldLabel } from "@amaxa/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amaxa/ui/select";

import type { FieldCondition, ConditionOperator, FormField } from "./types";

interface ConditionEditorProps {
  condition?: FieldCondition;
  availableFields: FormField[];
  onChange: (condition: FieldCondition | undefined) => void;
}

const OPERATORS: { value: ConditionOperator; label: string }[] = [
  { value: "equals", label: "is equal to" },
  { value: "notEquals", label: "is not equal to" },
  { value: "contains", label: "contains" },
];

export function ConditionEditor({
  condition,
  availableFields,
  onChange,
}: ConditionEditorProps) {
  // Filter to only select/multiselect fields that can be condition sources
  const sourceFields = useMemo(
    () =>
      availableFields.filter(
        (f) => f.type === "select" || f.type === "multiselect"
      ),
    [availableFields]
  );

  const selectedSourceField = useMemo(() => {
    if (!condition?.sourceFieldId) return undefined;
    return availableFields.find((f) => f._id === condition.sourceFieldId);
  }, [condition?.sourceFieldId, availableFields]);

  const handleSourceChange = (fieldId: string) => {
    const field = availableFields.find((f) => f._id === fieldId);
    if (!field) return;

    onChange({
      sourceFieldId: fieldId as Id<"applicationFormFields">,
      operator: "equals",
      value: "",
    });
  };

  const handleOperatorChange = (operator: string) => {
    if (!condition) return;
    onChange({
      ...condition,
      operator: operator as ConditionOperator,
    });
  };

  const handleValueChange = (value: string) => {
    if (!condition) return;
    // For contains operator with multiselect, we store as array
    if (condition.operator === "contains" && selectedSourceField?.type === "multiselect") {
      onChange({
        ...condition,
        value: value ? [value] : [],
      });
    } else {
      onChange({
        ...condition,
        value,
      });
    }
  };

  const handleClear = () => {
    onChange(undefined);
  };

  if (sourceFields.length === 0) {
    return (
      <div className="text-muted-foreground rounded-md border border-dashed p-4 text-center text-sm">
        No dropdown or checkbox fields available for conditions.
        <br />
        Add a dropdown or checkbox field first.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2">
        <div className="flex-1 space-y-3">
          <Field>
            <FieldLabel className="text-xs">Show when</FieldLabel>
            <Select
              value={condition?.sourceFieldId ?? ""}
              onValueChange={handleSourceChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a field" />
              </SelectTrigger>
              <SelectContent>
                {sourceFields.map((field) => (
                  <SelectItem key={field._id} value={field._id}>
                    {field.label || "Untitled Question"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {condition?.sourceFieldId && (
            <>
              <Field>
                <FieldLabel className="text-xs">Condition</FieldLabel>
                <Select
                  value={condition.operator}
                  onValueChange={handleOperatorChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPERATORS.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel className="text-xs">Value</FieldLabel>
                <Select
                  value={
                    Array.isArray(condition.value)
                      ? condition.value[0] ?? ""
                      : condition.value
                  }
                  onValueChange={handleValueChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a value" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedSourceField?.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </>
          )}
        </div>

        {condition && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleClear}
            className="mt-5"
            title="Remove condition"
          >
            <IconX className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
