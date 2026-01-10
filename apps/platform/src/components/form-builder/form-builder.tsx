"use client";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "convex/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { FormQuestionCard } from "./form-question-card";
import type { FormField } from "./types";

interface FormBuilderProps {
  formId: Id<"applicationForms">;
  fields?: FormField[];
}

export function FormBuilder({ formId, fields }: FormBuilderProps) {
  const [activeFieldId, setActiveFieldId] =
    useState<Id<"applicationFormFields"> | null>(null);

  const createField = useMutation(api.applicationFormFields.create);
  const deleteField = useMutation(api.applicationFormFields.remove);
  const reorderFields = useMutation(api.applicationFormFields.reorder);

  const handleAddField = useCallback(async () => {
    try {
      const newFieldId = await createField({
        formId,
        label: "Untitled Question",
        type: "text",
        required: false,
      });
      setActiveFieldId(newFieldId);
      toast.success("Question added");
    } catch (_error) {
      toast.error("Failed to add question");
    }
  }, [formId, createField]);

  const handleDeleteField = useCallback(
    async (fieldId: Id<"applicationFormFields">) => {
      try {
        await deleteField({ fieldId });
        if (activeFieldId === fieldId) {
          setActiveFieldId(null);
        }
        toast.success("Question deleted");
      } catch (_error) {
        toast.error("Failed to delete question");
      }
    },
    [deleteField, activeFieldId]
  );

  const handleDuplicateField = useCallback(
    async (field: FormField) => {
      try {
        const newFieldId = await createField({
          formId,
          label: `${field.label} (copy)`,
          description: field.description,
          type: field.type,
          required: field.required,
          options: field.options,
          min: field.min,
          max: field.max,
        });
        setActiveFieldId(newFieldId);
        toast.success("Question duplicated");
      } catch (_error) {
        toast.error("Failed to duplicate question");
      }
    },
    [formId, createField]
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent, fieldId: Id<"applicationFormFields">) => {
      e.dataTransfer.setData("fieldId", fieldId);
      e.dataTransfer.effectAllowed = "move";
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent, targetFieldId: Id<"applicationFormFields">) => {
      e.preventDefault();
      const sourceFieldId = e.dataTransfer.getData(
        "fieldId"
      ) as Id<"applicationFormFields">;

      if (sourceFieldId === targetFieldId) {
        return;
      }

      const sourceIndex = fields?.findIndex((f) => f._id === sourceFieldId);
      const targetIndex = fields?.findIndex((f) => f._id === targetFieldId);

      if (sourceIndex === -1 || targetIndex === -1) {
        return;
      }

      const newFieldIds = [...(fields?.map((f) => f._id) ?? [])];
      newFieldIds.splice(sourceIndex ?? 0, 1);
      newFieldIds.splice(targetIndex ?? 0, 0, sourceFieldId);

      try {
        await reorderFields({
          formId,
          fieldIds: newFieldIds,
        });
      } catch (_error) {
        toast.error("Failed to reorder questions");
      }
    },
    [fields, formId, reorderFields]
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Questions</CardTitle>
        <Button onClick={handleAddField} size="sm">
          <IconPlus className="mr-1 h-4 w-4" />
          Add Question
        </Button>
      </CardHeader>
      <CardContent>
        {fields?.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <p className="mb-2 text-lg">No questions yet</p>
            <p className="mb-4 text-sm">
              Add questions to start building your form.
            </p>
            <Button onClick={handleAddField} variant="outline">
              <IconPlus className="mr-1 h-4 w-4" />
              Add your first question
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {fields?.map((field) => (
              <div
                aria-label={`Form question ${field.label || "card"}`}
                className="w-full focus:outline-none"
                draggable
                key={field?._id}
                onDragOver={handleDragOver}
                onDragStart={(e) => handleDragStart(e, field._id)}
                onDrop={(e) => handleDrop(e, field?._id)}
                role="button"
                tabIndex={0}
              >
                <FormQuestionCard
                  field={field}
                  isActive={activeFieldId === field?._id}
                  onActivate={() => setActiveFieldId(field._id)}
                  onDelete={() => handleDeleteField(field._id)}
                  onDuplicate={() => handleDuplicateField(field)}
                />{" "}
              </div>
            ))}
            <Button
              className="w-full border-2 border-dashed text-muted-foreground hover:border-primary hover:text-foreground"
              onClick={handleAddField}
              variant="ghost"
            >
              <IconPlus className="mr-1 h-4 w-4" />
              Add Question
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
