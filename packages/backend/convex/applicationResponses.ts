import { v } from "convex/values";
import { api } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { requireSiteAdmin } from "./permissions";

const statusValidator = v.union(
  v.literal("pending"),
  v.literal("reviewed"),
  v.literal("accepted"),
  v.literal("rejected")
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
    })
  ),
});

const fieldResponseValueValidator = v.union(
  v.string(),
  v.array(v.string()),
  fileValueValidator
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
      })
    ),
  },
  returns: v.id("applicationResponses"),
  handler: async (ctx, args) => {
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
      args.fieldResponses.map((r) => r.fieldId.toString())
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
      if (!field || field.formId !== args.formId) {
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
    })
  ),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    let responses;

    if (args.status) {
      responses = await ctx.db
        .query("applicationResponses")
        .withIndex("by_form_and_status", (q) =>
          q.eq("formId", args.formId).eq("status", args.status!)
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
        })
      ),
    }),
    v.null()
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

    const enrichedResponses = await Promise.all(
      fieldResponses.map(async (fr) => {
        const field = await ctx.db.get(fr.fieldId);
        return {
          fieldId: fr.fieldId,
          fieldLabel: field?.label ?? "Unknown",
          fieldType: field?.type ?? "text",
          value: fr.value,
        };
      })
    );

    return {
      ...response,
      fieldResponses: enrichedResponses,
    };
  },
});

function generateToken(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
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
        const baseUrl =
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
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
          }
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
