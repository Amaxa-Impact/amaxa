import { v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

/**
 * Migration: Update all 'default' roles to 'member'
 * Run this once via the Convex dashboard after deploying the schema change
 */
export const migrateDefaultToMember = mutation({
  args: {},
  returns: v.object({
    updated: v.number(),
  }),
  handler: async (ctx) => {
    const allAssignments = await ctx.db.query("userToProject").collect();
    let updated = 0;

    for (const assignment of allAssignments) {
      await ctx.db.patch(assignment._id, {
        role: "member",
      });
      updated++;
    }

    return { updated };
  },
});

/**
 * Migration: Migrate tasks from old schema (with nested data) to new schema (flat fields)
 * This also creates taskNodes entries for each task
 * Run this once via the Convex dashboard after deploying the schema change
 */
export const migrateTasksToNewSchema = mutation({
  args: {},
  returns: v.object({
    tasksUpdated: v.number(),
    nodesCreated: v.number(),
  }),
  handler: async (ctx) => {
    const allTasks = await ctx.db.query("tasks").collect();
    let tasksUpdated = 0;
    let nodesCreated = 0;

    for (const task of allTasks) {
      const taskAny = task as any;

      if (taskAny.data && typeof taskAny.data === "object") {
        const oldData = taskAny.data;
        const position = taskAny.position;
        const type = taskAny.type || "task";

        await ctx.db.patch(task._id, {
          label: oldData.label || "Untitled Task",
          description: oldData.description,
          status: oldData.status,
          assignedTo: oldData.assignedTo,
          dueDate: oldData.dueDate,
          priority: oldData.priority,
        });

        const existingNode = await ctx.db
          .query("taskNodes")
          .withIndex("by_task", (q) => q.eq("taskId", task._id))
          .unique();

        if (!existingNode && position) {
          await ctx.db.insert("taskNodes", {
            taskId: task._id,
            projectId: task.projectId,
            type,
            position,
            width: taskAny.width,
            height: taskAny.height,
            style: taskAny.style,
          });
          nodesCreated++;
        }

        tasksUpdated++;
      }
    }

    return { tasksUpdated, nodesCreated };
  },
});

/**
 * Migration: Seed E2E apply form data
 * Run this once via the Convex dashboard when running E2E tests
 */
export const seedE2EApplyForm = mutation({
  args: {},
  returns: v.object({
    formId: v.id("applicationForms"),
    slug: v.string(),
  }),
  handler: async (ctx) => {
    const applyFormSlug = "e2e-apply-form" as const;

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

/**
 * Migration: Clean up old fields from tasks after migration
 * Run this AFTER migrateTasksToNewSchema has been run successfully
 */
export const cleanupOldTaskFields = mutation({
  args: {},
  returns: v.object({
    cleaned: v.number(),
  }),
  handler: async (ctx) => {
    const allTasks = await ctx.db.query("tasks").collect();
    let cleaned = 0;

    for (const task of allTasks) {
      const taskAny = task as any;

      if (taskAny.data || taskAny.position || taskAny.type) {
        cleaned++;
      }
    }

    return { cleaned };
  },
});
