"use node";

import { Resend } from "@convex-dev/resend";
import { render } from "@react-email/render";
import { v } from "convex/values";

import { components, internal } from "./_generated/api";
import { action } from "./_generated/server";
import { RejectionEmail } from "./emails/RejectionEmail";
import { SchedulingEmail } from "./emails/SchedulingEmail";

export const resend = new Resend(components.resend, {
  testMode: process.env.NODE_ENV !== "production",
});

export const sendSchedulingEmail = action({
  args: {
    to: v.string(),
    applicantName: v.string(),
    formTitle: v.string(),
    schedulingUrl: v.string(),
    tokenId: v.id("schedulingTokens"),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const html = await render(
        SchedulingEmail({
          applicantName: args.applicantName,
          formTitle: args.formTitle,
          schedulingUrl: args.schedulingUrl,
        }),
      );

      await resend.sendEmail(ctx, {
        from:
          process.env.RESEND_FROM_EMAIL ??
          "Amaxa <noreply@updates.amaxaimpact.org>",
        to: args.to,
        subject: `Schedule your interview for ${args.formTitle}`,
        html,
      });

      await ctx.runMutation(internal.schedulingInternal.markEmailSent, {
        tokenId: args.tokenId,
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to send scheduling email:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

export const sendRejectionEmail = action({
  args: {
    to: v.string(),
    applicantName: v.string(),
    formTitle: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const html = await render(
        RejectionEmail({
          applicantName: args.applicantName,
          formTitle: args.formTitle,
        }),
      );

      await resend.sendEmail(ctx, {
        from:
          process.env.RESEND_FROM_EMAIL ??
          "Amaxa <noreply@updates.amaxaimpact.org>",
        to: args.to,
        subject: `Update on your application for ${args.formTitle}`,
        html,
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to send rejection email:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
