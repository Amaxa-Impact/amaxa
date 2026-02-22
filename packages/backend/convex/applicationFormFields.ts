import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireSiteAdmin } from "./permissions";

const fieldTypeValidator = v.union(
  v.literal("text"),
  v.literal("textarea"),
  v.literal("number"),
  v.literal("select"),
  v.literal("multiselect"),
  v.literal("file")
);

const fileConfigValidator = v.object({
  maxSizeBytes: v.number(),
  allowedMimeTypes: v.array(v.string()),
  maxFiles: v.optional(v.number()),
});

const conditionValidator = v.object({
  sourceFieldId: v.id("applicationFormFields"),
  operator: v.union(
    v.literal("equals"),
    v.literal("notEquals"),
    v.literal("contains")
  ),
  value: v.union(v.string(), v.array(v.string())),
});

export const create = mutation({
  args: {
    formId: v.id("applicationForms"),
    sectionId: v.optional(v.id("applicationFormSections")),
    label: v.string(),
    description: v.optional(v.string()),
    type: fieldTypeValidator,
    required: v.boolean(),
    options: v.optional(v.array(v.string())),
    min: v.optional(v.number()),
    max: v.optional(v.number()),
    fileConfig: v.optional(fileConfigValidator),
    condition: v.optional(conditionValidator),
  },
  returns: v.id("applicationFormFields"),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    const form = await ctx.db.get(args.formId);
    if (!form) {
      throw new Error("Form not found");
    }

    const existingFields = await ctx.db
      .query("applicationFormFields")
      .withIndex("by_form", (q) => q.eq("formId", args.formId))
      .collect();

    const maxOrder = existingFields.reduce(
      (max, field) => Math.max(max, field.order),
      -1
    );

    const fieldId = await ctx.db.insert("applicationFormFields", {
      formId: args.formId,
      sectionId: args.sectionId,
      label: args.label,
      description: args.description,
      type: args.type,
      required: args.required,
      order: maxOrder + 1,
      options: args.options,
      min: args.min,
      max: args.max,
      fileConfig: args.fileConfig,
      condition: args.condition,
    });

    return fieldId;
  },
});

export const update = mutation({
  args: {
    fieldId: v.id("applicationFormFields"),
    sectionId: v.optional(v.id("applicationFormSections")),
    label: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(fieldTypeValidator),
    required: v.optional(v.boolean()),
    options: v.optional(v.array(v.string())),
    min: v.optional(v.number()),
    max: v.optional(v.number()),
    fileConfig: v.optional(fileConfigValidator),
    condition: v.optional(conditionValidator),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    const field = await ctx.db.get(args.fieldId);
    if (!field) {
      throw new Error("Field not found");
    }

    const { fieldId, ...updates } = args;
    await ctx.db.patch(fieldId, updates);
    return null;
  },
});

export const reorder = mutation({
  args: {
    formId: v.id("applicationForms"),
    fieldIds: v.array(v.id("applicationFormFields")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    for (const [i, fieldId] of args.fieldIds.entries()) {
      const field = await ctx.db.get(fieldId);

      if (!field) {
        throw new Error(`Field ${fieldId} not found`);
      }

      if (field.formId !== args.formId) {
        throw new Error(`Field ${fieldId} does not belong to this form`);
      }

      await ctx.db.patch(fieldId, { order: i });
    }

    return null;
  },
});

export const remove = mutation({
  args: {
    fieldId: v.id("applicationFormFields"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    const field = await ctx.db.get(args.fieldId);
    if (!field) {
      throw new Error("Field not found");
    }

    const fieldResponses = await ctx.db
      .query("applicationFieldResponses")
      .withIndex("by_fieldId", (q) => q.eq("fieldId", args.fieldId))
      .collect();

    for (const response of fieldResponses) {
      await ctx.db.delete(response._id);
    }

    await ctx.db.delete(args.fieldId);

    return null;
  },
});

export const listByForm = query({
  args: {
    slug: v.string(),
  },
  returns: v.array(
    v.object({
      _id: v.id("applicationFormFields"),
      _creationTime: v.number(),
      formId: v.id("applicationForms"),
      sectionId: v.optional(v.id("applicationFormSections")),
      label: v.string(),
      description: v.optional(v.string()),
      type: fieldTypeValidator,
      required: v.boolean(),
      order: v.number(),
      options: v.optional(v.array(v.string())),
      min: v.optional(v.number()),
      max: v.optional(v.number()),
      fileConfig: v.optional(fileConfigValidator),
      condition: v.optional(conditionValidator),
    })
  ),
  handler: async (ctx, args) => {
    const form = await ctx.db
      .query("applicationForms")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!form) {
      throw new Error("Form not found");
    }

    if (!form.isPublished) {
      await requireSiteAdmin(ctx);
    }

    const fields = await ctx.db
      .query("applicationFormFields")
      .withIndex("by_form", (q) => q.eq("formId", form._id))
      .collect();

    return fields.sort((a, b) => a.order - b.order);
  },
});

export const listByFormId = query({
  args: {
    formId: v.id("applicationForms"),
  },
  returns: v.array(
    v.object({
      _id: v.id("applicationFormFields"),
      _creationTime: v.number(),
      formId: v.id("applicationForms"),
      sectionId: v.optional(v.id("applicationFormSections")),
      label: v.string(),
      description: v.optional(v.string()),
      type: fieldTypeValidator,
      required: v.boolean(),
      order: v.number(),
      options: v.optional(v.array(v.string())),
      min: v.optional(v.number()),
      max: v.optional(v.number()),
      fileConfig: v.optional(fileConfigValidator),
      condition: v.optional(conditionValidator),
    })
  ),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    const form = await ctx.db.get(args.formId);
    if (!form) {
      throw new Error("Form not found");
    }

    const fields = await ctx.db
      .query("applicationFormFields")
      .withIndex("by_form", (q) => q.eq("formId", args.formId))
      .collect();

    return fields.sort((a, b) => a.order - b.order);
  },
});
