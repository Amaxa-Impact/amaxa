import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { requireSiteAdmin } from "./permissions";

const conditionValidator = v.object({
  sourceFieldId: v.id("applicationFormFields"),
  operator: v.union(
    v.literal("equals"),
    v.literal("notEquals"),
    v.literal("contains"),
  ),
  value: v.union(v.string(), v.array(v.string())),
});

export const create = mutation({
  args: {
    formId: v.id("applicationForms"),
    title: v.string(),
    description: v.optional(v.string()),
    condition: v.optional(conditionValidator),
  },
  returns: v.id("applicationFormSections"),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    const form = await ctx.db.get(args.formId);
    if (!form) {
      throw new Error("Form not found");
    }

    const existingSections = await ctx.db
      .query("applicationFormSections")
      .withIndex("by_form", (q) => q.eq("formId", args.formId))
      .collect();

    const maxOrder = existingSections.reduce(
      (max, section) => Math.max(max, section.order),
      -1,
    );

    return await ctx.db.insert("applicationFormSections", {
      formId: args.formId,
      title: args.title,
      description: args.description,
      order: maxOrder + 1,
      condition: args.condition,
    });
  },
});

export const update = mutation({
  args: {
    sectionId: v.id("applicationFormSections"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    order: v.optional(v.number()),
    condition: v.optional(conditionValidator),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    const section = await ctx.db.get(args.sectionId);
    if (!section) {
      throw new Error("Section not found");
    }

    const { sectionId, ...updates } = args;
    await ctx.db.patch(sectionId, updates);
    return null;
  },
});

export const reorder = mutation({
  args: {
    formId: v.id("applicationForms"),
    sectionIds: v.array(v.id("applicationFormSections")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    for (const [i, sectionId] of args.sectionIds.entries()) {
      const section = await ctx.db.get(sectionId);

      if (!section) {
        throw new Error(`Section ${sectionId} not found`);
      }

      if (section.formId !== args.formId) {
        throw new Error(`Section ${sectionId} does not belong to this form`);
      }

      await ctx.db.patch(sectionId, { order: i });
    }

    return null;
  },
});

export const remove = mutation({
  args: {
    sectionId: v.id("applicationFormSections"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    const section = await ctx.db.get(args.sectionId);
    if (!section) {
      throw new Error("Section not found");
    }

    const fields = await ctx.db
      .query("applicationFormFields")
      .withIndex("by_section", (q) => q.eq("sectionId", args.sectionId))
      .collect();

    if (fields.length > 0) {
      throw new Error(
        "Cannot delete section with fields. Move or delete fields first.",
      );
    }

    await ctx.db.delete(args.sectionId);
    return null;
  },
});

export const clearCondition = mutation({
  args: {
    sectionId: v.id("applicationFormSections"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    const section = await ctx.db.get(args.sectionId);
    if (!section) {
      throw new Error("Section not found");
    }

    await ctx.db.patch(args.sectionId, { condition: undefined });
    return null;
  },
});

export const listByFormId = query({
  args: {
    formId: v.id("applicationForms"),
  },
  returns: v.array(
    v.object({
      _id: v.id("applicationFormSections"),
      _creationTime: v.number(),
      formId: v.id("applicationForms"),
      title: v.string(),
      description: v.optional(v.string()),
      order: v.number(),
      condition: v.optional(conditionValidator),
    }),
  ),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    const form = await ctx.db.get(args.formId);
    if (!form) {
      throw new Error("Form not found");
    }

    const sections = await ctx.db
      .query("applicationFormSections")
      .withIndex("by_form", (q) => q.eq("formId", args.formId))
      .collect();

    return sections.sort((a, b) => a.order - b.order);
  },
});

export const listByFormSlug = query({
  args: {
    slug: v.string(),
  },
  returns: v.array(
    v.object({
      _id: v.id("applicationFormSections"),
      _creationTime: v.number(),
      formId: v.id("applicationForms"),
      title: v.string(),
      description: v.optional(v.string()),
      order: v.number(),
      condition: v.optional(conditionValidator),
    }),
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

    const sections = await ctx.db
      .query("applicationFormSections")
      .withIndex("by_form", (q) => q.eq("formId", form._id))
      .collect();

    return sections.sort((a, b) => a.order - b.order);
  },
});
