"use client";

import { useCallback, useMemo, useState } from "react";
import { IconPlus, IconLayoutList } from "@tabler/icons-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";
import { Button } from "@amaxa/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@amaxa/ui/card";

import type { FormField, FormSection } from "./types";
import { FormQuestionCard } from "./form-question-card";
import { SectionCard } from "./section-card";

interface FormBuilderProps {
  formId: Id<"applicationForms">;
  fields?: FormField[];
  sections?: FormSection[];
}

interface SortableSectionProps {
  section: FormSection;
  fields: FormField[];
  allFields: FormField[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  activeFieldId: Id<"applicationFormFields"> | null;
  onActivateField: (fieldId: Id<"applicationFormFields">) => void;
  onDeleteField: (fieldId: Id<"applicationFormFields">) => void;
  onDuplicateField: (field: FormField) => void;
  onAddField: (sectionId: Id<"applicationFormSections">) => void;
}

function SortableSection({
  section,
  fields,
  allFields,
  isExpanded,
  onToggleExpand,
  activeFieldId,
  onActivateField,
  onDeleteField,
  onDuplicateField,
  onAddField,
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <SectionCard
        section={section}
        fields={fields}
        allFields={allFields}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
        activeFieldId={activeFieldId}
        onActivateField={onActivateField}
        onDeleteField={onDeleteField}
        onDuplicateField={onDuplicateField}
        onAddField={onAddField}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export function FormBuilder({ formId, fields, sections }: FormBuilderProps) {
  const [activeFieldId, setActiveFieldId] =
    useState<Id<"applicationFormFields"> | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections?.map((s) => s._id) ?? [])
  );

  const createField = useMutation(api.applicationFormFields.create);
  const deleteField = useMutation(api.applicationFormFields.remove);
  const reorderFields = useMutation(api.applicationFormFields.reorder);
  const createSection = useMutation(api.applicationFormSections.create);
  const reorderSections = useMutation(api.applicationFormSections.reorder);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group fields by section
  const fieldsBySection = useMemo(() => {
    const grouped: Record<
      Id<"applicationFormSections"> | "unsectioned",
      FormField[]
    > = {
      unsectioned: [],
    };

    sections?.forEach((s) => {
      grouped[s._id] = [];
    });

    fields?.forEach((field) => {
      if (field.sectionId && grouped[field.sectionId]) {
        grouped[field.sectionId].push(field);
      } else {
        grouped.unsectioned.push(field);
      }
    });

    return grouped;
  }, [fields, sections]);

  const hasSections = sections && sections.length > 0;
  const sectionIds = useMemo(
    () => sections?.map((s) => s._id) ?? [],
    [sections]
  );

  const handleSectionDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id || !sections) {
        return;
      }

      const oldIndex = sections.findIndex((s) => s._id === active.id);
      const newIndex = sections.findIndex((s) => s._id === over.id);

      if (oldIndex === -1 || newIndex === -1) {
        return;
      }

      const reorderedSections = arrayMove(sections, oldIndex, newIndex);
      const newSectionIds = reorderedSections.map((s) => s._id);

      try {
        await reorderSections({
          formId,
          sectionIds: newSectionIds,
        });
      } catch {
        toast.error("Failed to reorder sections");
      }
    },
    [sections, formId, reorderSections]
  );

  const handleAddSection = useCallback(async () => {
    try {
      const newSectionId = await createSection({
        formId,
        title: "New Section",
      });
      setExpandedSections((prev) => new Set([...prev, newSectionId]));
      toast.success("Section added");
    } catch {
      toast.error("Failed to add section");
    }
  }, [formId, createSection]);

  const handleAddField = useCallback(
    async (sectionId?: Id<"applicationFormSections">) => {
      try {
        const newFieldId = await createField({
          formId,
          label: "Untitled Question",
          type: "text",
          required: false,
          sectionId,
        });
        setActiveFieldId(newFieldId);
        toast.success("Question added");
      } catch {
        toast.error("Failed to add question");
      }
    },
    [formId, createField]
  );

  const handleDeleteField = useCallback(
    async (fieldId: Id<"applicationFormFields">) => {
      try {
        await deleteField({ fieldId });
        if (activeFieldId === fieldId) {
          setActiveFieldId(null);
        }
        toast.success("Question deleted");
      } catch {
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
          sectionId: field.sectionId,
          fileConfig: field.fileConfig,
        });
        setActiveFieldId(newFieldId);
        toast.success("Question duplicated");
      } catch {
        toast.error("Failed to duplicate question");
      }
    },
    [formId, createField]
  );

  const toggleSectionExpanded = useCallback(
    (sectionId: Id<"applicationFormSections">) => {
      setExpandedSections((prev) => {
        const next = new Set(prev);
        if (next.has(sectionId)) {
          next.delete(sectionId);
        } else {
          next.add(sectionId);
        }
        return next;
      });
    },
    []
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
    async (
      e: React.DragEvent,
      targetFieldId: Id<"applicationFormFields">
    ) => {
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
      } catch {
        toast.error("Failed to reorder questions");
      }
    },
    [fields, formId, reorderFields]
  );

  // Render unsectioned fields (backward compatible mode or fields without section)
  const renderUnsectionedFields = () => {
    const unsectionedFields = fieldsBySection.unsectioned;

    if (unsectionedFields.length === 0 && !hasSections) {
      return (
        <div className="text-muted-foreground py-12 text-center">
          <p className="mb-2 text-lg">No questions yet</p>
          <p className="mb-4 text-sm">
            Add questions to start building your form.
          </p>
          <Button onClick={() => handleAddField()} variant="outline">
            <IconPlus className="mr-1 h-4 w-4" />
            Add your first question
          </Button>
        </div>
      );
    }

    if (unsectionedFields.length === 0) {
      return null;
    }

    return (
      <div className="space-y-4">
        {!hasSections && (
          <div className="text-muted-foreground text-sm">
            Questions without sections:
          </div>
        )}
        {unsectionedFields.map((field) => (
          <div
            aria-label={`Form question ${field.label || "card"}`}
            className="w-full focus:outline-none"
            draggable
            key={field._id}
            onDragOver={handleDragOver}
            onDragStart={(e) => handleDragStart(e, field._id)}
            onDrop={(e) => handleDrop(e, field._id)}
            role="button"
            tabIndex={0}
          >
            <FormQuestionCard
              field={field}
              isActive={activeFieldId === field._id}
              onActivate={() => setActiveFieldId(field._id)}
              onDelete={() => handleDeleteField(field._id)}
              onDuplicate={() => handleDuplicateField(field)}
            />
          </div>
        ))}
        {!hasSections && (
          <Button
            className="text-muted-foreground hover:border-primary hover:text-foreground w-full border-2 border-dashed"
            onClick={() => handleAddField()}
            variant="ghost"
          >
            <IconPlus className="mr-1 h-4 w-4" />
            Add Question
          </Button>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Questions</CardTitle>
        <div className="flex gap-2">
          <Button onClick={handleAddSection} size="sm" variant="outline">
            <IconLayoutList className="mr-1 h-4 w-4" />
            Add Section
          </Button>
          {!hasSections && (
            <Button onClick={() => handleAddField()} size="sm">
              <IconPlus className="mr-1 h-4 w-4" />
              Add Question
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Render sections if they exist */}
          {hasSections && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleSectionDragEnd}
            >
              <SortableContext
                items={sectionIds}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {sections.map((section) => (
                    <SortableSection
                      key={section._id}
                      section={section}
                      fields={fieldsBySection[section._id] ?? []}
                      allFields={fields ?? []}
                      isExpanded={expandedSections.has(section._id)}
                      onToggleExpand={() => toggleSectionExpanded(section._id)}
                      activeFieldId={activeFieldId}
                      onActivateField={setActiveFieldId}
                      onDeleteField={handleDeleteField}
                      onDuplicateField={handleDuplicateField}
                      onAddField={handleAddField}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {hasSections && (
            <Button
              className="text-muted-foreground hover:border-primary hover:text-foreground w-full border-2 border-dashed"
              onClick={handleAddSection}
              variant="ghost"
            >
              <IconLayoutList className="mr-1 h-4 w-4" />
              Add Section
            </Button>
          )}

          {/* Render unsectioned fields */}
          {renderUnsectionedFields()}
        </div>
      </CardContent>
    </Card>
  );
}
