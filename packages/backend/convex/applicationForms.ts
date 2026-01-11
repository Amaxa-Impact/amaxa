import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireSiteAdmin } from "./permissions";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    slug: v.string(),
  },
  returns: v.id("applicationForms"),
  handler: async (ctx, args) => {
    const userId = await requireSiteAdmin(ctx);

    const existing = await ctx.db
      .query("applicationForms")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      throw new Error("A form with this slug already exists");
    }

    const formId = await ctx.db.insert("applicationForms", {
      title: args.title,
      description: args.description,
      slug: args.slug,
      isPublished: false,
      createdBy: userId,
    });

    return formId;
  },
});

export const update = mutation({
  args: {
    formId: v.id("applicationForms"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    slug: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    const form = await ctx.db.get(args.formId);
    if (!form) {
      throw new Error("Form not found");
    }

    if (args.slug && args.slug !== form.slug) {
      const newSlug = args.slug;
      const existing = await ctx.db
        .query("applicationForms")
        .withIndex("by_slug", (q) => q.eq("slug", newSlug))
        .unique();

      if (existing) {
        throw new Error("A form with this slug already exists");
      }
    }

    const { formId, ...updates } = args;
    await ctx.db.patch(formId, updates);
    return null;
  },
});

export const get = query({
  args: {
    formId: v.id("applicationForms"),
  },
  returns: v.union(
    v.object({
      _id: v.id("applicationForms"),
      _creationTime: v.number(),
      title: v.string(),
      description: v.optional(v.string()),
      isPublished: v.boolean(),
      slug: v.string(),
      createdBy: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);
    return await ctx.db.get(args.formId);
  },
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  returns: v.union(
    v.object({
      _id: v.id("applicationForms"),
      _creationTime: v.number(),
      title: v.string(),
      description: v.optional(v.string()),
      isPublished: v.boolean(),
      slug: v.string(),
      createdBy: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const form = await ctx.db
      .query("applicationForms")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (form && !form.isPublished) {
      return null;
    }

    return form;
  },
});

export const getPublicForm = query({
  args: {
    slug: v.string(),
  },
  returns: v.union(
    v.object({
      _id: v.id("applicationForms"),
      _creationTime: v.number(),
      title: v.string(),
      description: v.optional(v.string()),
      isPublished: v.boolean(),
      slug: v.string(),
      createdBy: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const form = await ctx.db
      .query("applicationForms")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!form?.isPublished) {
      return null;
    }

    return form;
  },
});

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("applicationForms"),
      _creationTime: v.number(),
      title: v.string(),
      description: v.optional(v.string()),
      isPublished: v.boolean(),
      slug: v.string(),
      createdBy: v.string(),
      responseCount: v.number(),
    })
  ),
  handler: async (ctx) => {
    await requireSiteAdmin(ctx);

    const forms = await ctx.db.query("applicationForms").collect();

    const formsWithCounts = await Promise.all(
      forms.map(async (form) => {
        const responses = await ctx.db
          .query("applicationResponses")
          .withIndex("by_form", (q) => q.eq("formId", form._id))
          .collect();

        return {
          ...form,
          responseCount: responses.length,
        };
      })
    );

    return formsWithCounts;
  },
});

export const remove = mutation({
  args: {
    formId: v.id("applicationForms"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    const responses = await ctx.db
      .query("applicationResponses")
      .withIndex("by_form", (q) => q.eq("formId", args.formId))
      .collect();

    for (const response of responses) {
      const fieldResponses = await ctx.db
        .query("applicationFieldResponses")
        .withIndex("by_response", (q) => q.eq("responseId", response._id))
        .collect();

      for (const fieldResponse of fieldResponses) {
        await ctx.db.delete(fieldResponse._id);
      }

      await ctx.db.delete(response._id);
    }

    const fields = await ctx.db
      .query("applicationFormFields")
      .withIndex("by_form", (q) => q.eq("formId", args.formId))
      .collect();

    for (const field of fields) {
      await ctx.db.delete(field._id);
    }

    await ctx.db.delete(args.formId);

    return null;
  },
});
