"use node";

import { Resend } from "@convex-dev/resend";
import { render } from "@react-email/render";
import { v } from "convex/values";

import { components } from "./_generated/api";
import { internalAction } from "./_generated/server";
import { WorkspaceInvitationEmail } from "./emails/WorkspaceInvitationEmail";

export const resend = new Resend(components.resend, {
  testMode: process.env.NODE_ENV !== "production",
});

export const sendInvitationEmail = internalAction({
  args: {
    invitationId: v.id("workspaceInvitations"),
    to: v.string(),
    workspaceName: v.string(),
    token: v.string(),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const baseUrl =
        // eslint-disable-next-line turbo/no-undeclared-env-vars 
        process.env.NEXT_PUBLIC_SITE_URL ?? "https://app.amaxaimpact.org";
      const inviteUrl = `${baseUrl}/invite/${args.token}`;

      const html = await render(
        WorkspaceInvitationEmail({
          workspaceName: args.workspaceName,
          inviteUrl,
          role: args.role,
        }),
      );

      await resend.sendEmail(ctx, {
        from:
          process.env.RESEND_FROM_EMAIL ??
          "Amaxa <noreply@updates.amaxaimpact.org>",
        to: args.to,
        subject: `You've been invited to join ${args.workspaceName} on Amaxa`,
        html,
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to send invitation email:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
