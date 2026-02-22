/** biome-ignore-all lint/correctness/noChildrenProp: <explanation> */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";
import { cn } from "@amaxa/ui";
import { Card, CardContent } from "@amaxa/ui/card";
import { Input } from "@amaxa/ui/input";
import { Textarea } from "@amaxa/ui/textarea";

import type { FormData } from "./types";

interface FormHeaderProps {
  form: FormData;
  formId: Id<"applicationForms">;
}

export function FormHeader({ form, formId }: FormHeaderProps) {
  const [isActive, setIsActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const updateForm = useMutation(api.applicationForms.update);

  const formState = useForm({
    defaultValues: {
      title: form.title,
      description: form.description ?? "",
    },
  });

  const saveChanges = useCallback(
    async (values: { title: string; description: string }) => {
      if (!values.title.trim()) {
        return;
      }

      setIsSaving(true);
      try {
        await updateForm({
          formId,
          title: values.title.trim(),
          description: values.description.trim() || undefined,
        });
      } catch {
        toast.error("Failed to save form");
      } finally {
        setIsSaving(false);
      }
    },
    [formId, updateForm],
  );

  const debouncedSave = useCallback(
    (values: { title: string; description: string }) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        void saveChanges(values);
      }, 500);
    },
    [saveChanges],
  );

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Card
      className={cn(
        "border-t-4 transition-all",
        isActive
          ? "border-t-primary ring-primary/20 ring-1"
          : "border-t-primary/50",
      )}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsActive(false);
        }
      }}
      onClick={() => setIsActive(true)}
    >
      <CardContent className="space-y-4 pt-6">
        {isSaving && (
          <div className="text-muted-foreground text-right text-xs">
            Saving...
          </div>
        )}

        <formState.Field name="title">
          {(field) => (
            <Input
              className={cn(
                "focus-visible:border-primary rounded-none border-0 border-b px-0 text-2xl font-bold focus-visible:ring-0",
                isActive ? "border-b-2" : "",
              )}
              id="form-title"
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(e) => {
                field.handleChange(e.target.value);
                debouncedSave({
                  title: e.target.value,
                  description: formState.state.values.description,
                });
              }}
              placeholder="Form title"
              ref={titleInputRef}
              value={field.state.value}
            />
          )}
        </formState.Field>

        <formState.Field name="description">
          {(field) => (
            <Textarea
              className={cn(
                "focus-visible:border-primary resize-none rounded-none border-0 border-b px-0 focus-visible:ring-0",
                isActive ? "border-b-2" : "",
              )}
              id="form-description"
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(e) => {
                field.handleChange(e.target.value);
                debouncedSave({
                  title: formState.state.values.title,
                  description: e.target.value,
                });
              }}
              placeholder="Form description (optional)"
              rows={2}
              value={field.state.value}
            />
          )}
        </formState.Field>
      </CardContent>
    </Card>
  );
}
