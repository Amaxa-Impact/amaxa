import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const markEmailSent = internalMutation({
  args: {
    tokenId: v.id("schedulingTokens"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.tokenId, {
      emailSentAt: Date.now(),
    });
    return null;
  },
});
