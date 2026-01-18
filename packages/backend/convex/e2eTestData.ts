import { v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

const applyFormSlug = "e2e-apply-form" as const;

export const seedApplyForm = mutation({
  args: {},
  returns: v.object({
    formId: v.id("applicationForms"),
    slug: v.string(),
  }),
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("applicationForms")
      .withIndex("by_slug", (q) => q.eq("slug", applyFormSlug))
      .unique();

    if (existing) {
      return { formId: existing._id, slug: applyFormSlug };
    }

    const formId = await ctx.db.insert("applicationForms", {
      title: "E2E Apply Form",
      description: "Seeded form for automated tests",
      slug: applyFormSlug,
      isPublished: true,
      createdBy: "e2e-test",
    });

    const fieldConfigs: Array<{
      label: string;
      description: string;
      type: "text" | "textarea" | "number" | "select" | "multiselect" | "file";
      required: boolean;
      order: number;
      min?: number;
      max?: number;
      options?: string[];
      condition?: {
        sourceFieldId: Id<"applicationFormFields">;
        operator: "equals" | "notEquals" | "contains";
        value: string | string[];
      };
      fileConfig?: {
        maxSizeBytes: number;
        allowedMimeTypes: string[];
        maxFiles?: number;
      };
    }> = [
      {
        label: "Short Answer",
        description: "Required text input",
        type: "text",
        required: true,
        order: 0,
      },
      {
        label: "Long Answer",
        description: "Optional long response",
        type: "textarea",
        required: false,
        order: 1,
        max: 140,
      },
      {
        label: "Number Input",
        description: "Number between 1 and 5",
        type: "number",
        required: true,
        order: 2,
        min: 1,
        max: 5,
      },
      {
        label: "Experience Level",
        description: "Choose one option",
        type: "select",
        required: true,
        order: 3,
        options: ["Yes", "No"],
      },
      {
        label: "Skills",
        description: "Select all that apply",
        type: "multiselect",
        required: true,
        order: 4,
        options: ["TypeScript", "React", "Design"],
      },
      {
        label: "Resume",
        description: "Upload a PDF resume",
        type: "file",
        required: false,
        order: 5,
        fileConfig: {
          maxSizeBytes: 5 * 1024 * 1024,
          allowedMimeTypes: ["application/pdf"],
          maxFiles: 1,
        },
      },
    ];

    const fieldIds: Array<Id<"applicationFormFields">> = [];
    for (const config of fieldConfigs) {
      const fieldId = await ctx.db.insert("applicationFormFields", {
        formId,
        label: config.label,
        description: config.description,
        type: config.type,
        required: config.required,
        order: config.order,
        min: config.min,
        max: config.max,
        options: config.options,
        fileConfig: config.fileConfig,
        condition: config.condition,
      });
      fieldIds.push(fieldId);
    }

    const experienceFieldId = fieldIds[3];
    await ctx.db.insert("applicationFormFields", {
      formId,
      label: "Experience Details",
      description: "Shown when experience is Yes",
      type: "textarea",
      required: true,
      order: 6,
      condition: {
        sourceFieldId: experienceFieldId,
        operator: "equals",
        value: "Yes",
      },
    });

    return { formId, slug: applyFormSlug };
  },
});
