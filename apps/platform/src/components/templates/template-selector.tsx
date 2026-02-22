"use client";

import { useQuery } from "convex/react";

import { api } from "@amaxa/backend/_generated/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amaxa/ui/select";

export const blankTemplateValue = "blank" as const;

export function TemplateSelector({
  workspaceSlug,
  value,
  onValueChange,
}: {
  workspaceSlug: string;
  value: string;
  onValueChange: (value: string) => void;
}) {
  const templates = useQuery(api.projectTemplates.list, {
    workspaceSlug,
  });
  const selectedTemplateLabel =
    value === blankTemplateValue
      ? "Blank project"
      : templates?.find((template) => template._id === value)?.name ??
        (templates === undefined ? "Loading template..." : "Template");

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor="create-project-template">
        Template
      </label>
      <Select
        onValueChange={(nextValue: string | null) => {
          if (nextValue) {
            onValueChange(nextValue);
          }
        }}
        value={value}
      >
        <SelectTrigger id="create-project-template">
          <SelectValue>{selectedTemplateLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={blankTemplateValue}>Blank project</SelectItem>
          {(templates ?? []).map((template) => (
            <SelectItem key={template._id} value={template._id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-muted-foreground text-xs">
        Choose a template to scaffold tasks and dependencies.
      </p>
    </div>
  );
}
