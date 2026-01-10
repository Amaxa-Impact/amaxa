import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireSiteAdmin } from "./permissions";

function generateToken(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export const getByToken = query({
  args: {
    token: v.string(),
  },
  returns: v.union(
    v.object({
      responseId: v.id("applicationResponses"),
      formId: v.id("applicationForms"),
      applicantName: v.string(),
      applicantEmail: v.string(),
      formTitle: v.string(),
      isExpired: v.boolean(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const tokenRecord = await ctx.db
      .query("schedulingTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!tokenRecord) {
      return null;
    }

    const response = await ctx.db.get(tokenRecord.responseId);
    if (!response) {
      return null;
    }

    const form = await ctx.db.get(tokenRecord.formId);
    if (!form) {
      return null;
    }

    const isExpired = tokenRecord.expiresAt
      ? tokenRecord.expiresAt < Date.now()
      : false;

    return {
      responseId: tokenRecord.responseId,
      formId: tokenRecord.formId,
      applicantName: response.applicantName,
      applicantEmail: response.applicantEmail,
      formTitle: form.title,
      isExpired,
    };
  },
});

export const getByResponse = query({
  args: {
    responseId: v.id("applicationResponses"),
  },
  returns: v.union(
    v.object({
      _id: v.id("schedulingTokens"),
      token: v.string(),
      createdAt: v.number(),
      expiresAt: v.optional(v.number()),
      emailSentAt: v.optional(v.number()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    const tokenRecord = await ctx.db
      .query("schedulingTokens")
      .withIndex("by_response", (q) => q.eq("responseId", args.responseId))
      .unique();

    if (!tokenRecord) {
      return null;
    }

    return {
      _id: tokenRecord._id,
      token: tokenRecord.token,
      createdAt: tokenRecord.createdAt,
      expiresAt: tokenRecord.expiresAt,
      emailSentAt: tokenRecord.emailSentAt,
    };
  },
});

export const create = mutation({
  args: {
    responseId: v.id("applicationResponses"),
  },
  returns: v.object({
    token: v.string(),
    tokenId: v.id("schedulingTokens"),
  }),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    const response = await ctx.db.get(args.responseId);
    if (!response) {
      throw new Error("Application response not found");
    }

    if (response.status !== "accepted") {
      throw new Error(
        "Can only create scheduling tokens for accepted applicants"
      );
    }

    const existingToken = await ctx.db
      .query("schedulingTokens")
      .withIndex("by_response", (q) => q.eq("responseId", args.responseId))
      .unique();

    if (existingToken) {
      throw new Error("A scheduling token already exists for this applicant");
    }

    const token = generateToken();

    const tokenId = await ctx.db.insert("schedulingTokens", {
      responseId: args.responseId,
      formId: response.formId,
      token,
      createdAt: Date.now(),
    });

    return { token, tokenId };
  },
});

export const regenerate = mutation({
  args: {
    responseId: v.id("applicationResponses"),
  },
  returns: v.object({
    token: v.string(),
    tokenId: v.id("schedulingTokens"),
  }),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    const existingToken = await ctx.db
      .query("schedulingTokens")
      .withIndex("by_response", (q) => q.eq("responseId", args.responseId))
      .unique();

    if (existingToken) {
      await ctx.db.delete(existingToken._id);
    }

    const response = await ctx.db.get(args.responseId);
    if (!response) {
      throw new Error("Application response not found");
    }

    const token = generateToken();

    const tokenId = await ctx.db.insert("schedulingTokens", {
      responseId: args.responseId,
      formId: response.formId,
      token,
      createdAt: Date.now(),
    });

    return { token, tokenId };
  },
});

export const markEmailSent = mutation({
  args: {
    tokenId: v.id("schedulingTokens"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    const tokenRecord = await ctx.db.get(args.tokenId);
    if (!tokenRecord) {
      throw new Error("Token not found");
    }

    await ctx.db.patch(args.tokenId, {
      emailSentAt: Date.now(),
    });

    return null;
  },
});
