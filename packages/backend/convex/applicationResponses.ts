import { ConvexError, v } from "convex/values";

import type { MutationCtx } from "./_generated/server";
import { api } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { requireSiteAdmin } from "./permissions";

// Rate limiting for form submissions: 10 submissions per hour per email
const SUBMIT_RATE_LIMIT = 10;
const SUBMIT_RATE_WINDOW_MS = 3600000; // 1 hour

async function checkSubmitRateLimit(
  ctx: MutationCtx,
  email: string,
): Promise<void> {
  const action = `formSubmit:${email.toLowerCase()}`;
  const now = Date.now();

  const existing = await ctx.db
    .query("rateLimits")
    .withIndex("by_userId_and_action", (q) =>
      q.eq("userId", email.toLowerCase()).eq("action", action),
    )
    .unique();

  if (!existing) {
    await ctx.db.insert("rateLimits", {
      userId: email.toLowerCase(),
      action,
      count: 1,
      windowStart: now,
    });
    return;
  }

  if (now - existing.windowStart > SUBMIT_RATE_WINDOW_MS) {
    await ctx.db.patch(existing._id, {
      count: 1,
      windowStart: now,
    });
    return;
  }

  if (existing.count >= SUBMIT_RATE_LIMIT) {
    throw new ConvexError({
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many submissions. Please try again later.",
    });
  }

  await ctx.db.patch(existing._id, {
    count: existing.count + 1,
  });
}

const statusValidator = v.union(
  v.literal("pending"),
  v.literal("reviewed"),
  v.literal("accepted"),
  v.literal("rejected"),
);

const fileValueValidator = v.object({
  type: v.literal("file"),
  files: v.array(
    v.object({
      blobId: v.string(),
      path: v.string(),
      filename: v.string(),
      contentType: v.string(),
      sizeBytes: v.number(),
    }),
  ),
});

const fieldResponseValueValidator = v.union(
  v.string(),
  v.array(v.string()),
  fileValueValidator,
);

export const submit = mutation({
  args: {
    formId: v.id("applicationForms"),
    applicantName: v.string(),
    applicantEmail: v.string(),
    fieldResponses: v.array(
      v.object({
        fieldId: v.id("applicationFormFields"),
        value: fieldResponseValueValidator,
      }),
    ),
  },
  returns: v.id("applicationResponses"),
  handler: async (ctx, args) => {
    // Rate limit by email address to prevent spam
    await checkSubmitRateLimit(ctx, args.applicantEmail);

    const form = await ctx.db.get(args.formId);
    if (!form) {
      throw new Error("Form not found");
    }
    if (!form.isPublished) {
      throw new Error("This form is not accepting applications");
    }

    const fields = await ctx.db
      .query("applicationFormFields")
      .withIndex("by_form", (q) => q.eq("formId", args.formId))
      .collect();

    const providedFieldIds = new Set(
      args.fieldResponses.map((r) => r.fieldId.toString()),
    );

    for (const field of fields) {
      if (field.required && !providedFieldIds.has(field._id.toString())) {
        throw new Error(`Required field "${field.label}" is missing`);
      }
    }

    const responseId = await ctx.db.insert("applicationResponses", {
      formId: args.formId,
      applicantName: args.applicantName,
      applicantEmail: args.applicantEmail,
      submittedAt: Date.now(),
      status: "pending",
    });

    for (const fieldResponse of args.fieldResponses) {
      const field = await ctx.db.get(fieldResponse.fieldId);
      if (field?.formId !== args.formId) {
        throw new Error("Invalid field");
      }

      await ctx.db.insert("applicationFieldResponses", {
        responseId,
        fieldId: fieldResponse.fieldId,
        value: fieldResponse.value,
      });
    }

    return responseId;
  },
});

export const list = query({
  args: {
    formId: v.id("applicationForms"),
    status: v.optional(statusValidator),
  },
  returns: v.array(
    v.object({
      _id: v.id("applicationResponses"),
      _creationTime: v.number(),
      formId: v.id("applicationForms"),
      submittedAt: v.number(),
      applicantName: v.string(),
      applicantEmail: v.string(),
      status: statusValidator,
    }),
  ),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    let responses;

    if (args.status) {
      responses = await ctx.db
        .query("applicationResponses")
        .withIndex("by_form_and_status", (q) =>
          q.eq("formId", args.formId).eq("status", args.status!),
        )
        .collect();
    } else {
      responses = await ctx.db
        .query("applicationResponses")
        .withIndex("by_form", (q) => q.eq("formId", args.formId))
        .collect();
    }

    return responses.sort((a, b) => b.submittedAt - a.submittedAt);
  },
});

export const get = query({
  args: {
    responseId: v.id("applicationResponses"),
  },
  returns: v.union(
    v.object({
      _id: v.id("applicationResponses"),
      _creationTime: v.number(),
      formId: v.id("applicationForms"),
      submittedAt: v.number(),
      applicantName: v.string(),
      applicantEmail: v.string(),
      status: statusValidator,
      fieldResponses: v.array(
        v.object({
          fieldId: v.id("applicationFormFields"),
          fieldLabel: v.string(),
          fieldType: v.string(),
          value: fieldResponseValueValidator,
        }),
      ),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    const response = await ctx.db.get(args.responseId);
    if (!response) {
      return null;
    }

    const fieldResponses = await ctx.db
      .query("applicationFieldResponses")
      .withIndex("by_response", (q) => q.eq("responseId", args.responseId))
      .collect();

    // Batch load all fields to avoid N+1 queries
    const fieldIds = [...new Set(fieldResponses.map((fr) => fr.fieldId))];
    const fields = await Promise.all(fieldIds.map((id) => ctx.db.get(id)));

    // Create a map for O(1) lookup
    const fieldMap = new Map(
      fields
        .filter((f): f is NonNullable<typeof f> => f !== null)
        .map((f) => [f._id.toString(), f]),
    );

    const enrichedResponses = fieldResponses.map((fr) => {
      const field = fieldMap.get(fr.fieldId.toString());
      return {
        fieldId: fr.fieldId,
        fieldLabel: field?.label ?? "Unknown",
        fieldType: field?.type ?? "text",
        value: fr.value,
      };
    });

    return {
      ...response,
      fieldResponses: enrichedResponses,
    };
  },
});

function generateToken(): string {
  // Use crypto.randomUUID() for cryptographically secure token generation
  return crypto.randomUUID().replace(/-/g, "");
}

export const updateStatus = mutation({
  args: {
    responseId: v.id("applicationResponses"),
    status: statusValidator,
    sendSchedulingEmail: v.optional(v.boolean()),
    sendRejectionEmail: v.optional(v.boolean()),
  },
  returns: v.object({
    success: v.boolean(),
    schedulingToken: v.optional(v.string()),
    emailSent: v.optional(v.boolean()),
  }),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    const response = await ctx.db.get(args.responseId);
    if (!response) {
      throw new Error("Response not found");
    }

    const wasAlreadyAccepted = response.status === "accepted";
    const wasAlreadyRejected = response.status === "rejected";
    await ctx.db.patch(args.responseId, { status: args.status });

    if (args.status === "accepted" && !wasAlreadyAccepted) {
      const existingToken = await ctx.db
        .query("schedulingTokens")
        .withIndex("by_response", (q) => q.eq("responseId", args.responseId))
        .unique();

      let token: string;
      let tokenId;

      if (existingToken) {
        token = existingToken.token;
        tokenId = existingToken._id;
      } else {
        token = generateToken();
        tokenId = await ctx.db.insert("schedulingTokens", {
          responseId: args.responseId,
          formId: response.formId,
          token,
          createdAt: Date.now(),
        });
      }

      if (args.sendSchedulingEmail !== false) {
        const form = await ctx.db.get(response.formId);
        // Use CONVEX_SITE_URL for backend, fallback to NEXT_PUBLIC_APP_URL for compatibility
        const baseUrl =
          process.env.CONVEX_SITE_URL ||
          process.env.NEXT_PUBLIC_APP_URL ||
          "http://localhost:3000";
        const schedulingUrl = `${baseUrl}/schedule/${token}`;

        await ctx.scheduler.runAfter(
          0,
          api.schedulingEmail.sendSchedulingEmail,
          {
            to: response.applicantEmail,
            applicantName: response.applicantName,
            formTitle: form?.title ?? "Application",
            schedulingUrl,
            tokenId,
          },
        );
      }

      return { success: true, schedulingToken: token, emailSent: true };
    }

    if (
      args.status === "rejected" &&
      !wasAlreadyRejected &&
      args.sendRejectionEmail
    ) {
      const form = await ctx.db.get(response.formId);

      await ctx.scheduler.runAfter(0, api.schedulingEmail.sendRejectionEmail, {
        to: response.applicantEmail,
        applicantName: response.applicantName,
        formTitle: form?.title ?? "Application",
      });

      return { success: true, emailSent: true };
    }

    return { success: true };
  },
});

export const remove = mutation({
  args: {
    responseId: v.id("applicationResponses"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    const response = await ctx.db.get(args.responseId);
    if (!response) {
      throw new Error("Response not found");
    }

    const fieldResponses = await ctx.db
      .query("applicationFieldResponses")
      .withIndex("by_response", (q) => q.eq("responseId", args.responseId))
      .collect();

    for (const fr of fieldResponses) {
      await ctx.db.delete(fr._id);
    }

    await ctx.db.delete(args.responseId);

    return null;
  },
});
