import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { Guides } from "@amaxa/db/schema";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const actionGuideRouter = createTRPCRouter({
  getActionGuides: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.guides.findMany({});
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        embedId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "Admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You do not have permission to create an action guide",
        });
      }
      const { title, description, embedId } = input;
      await ctx.db.insert(Guides).values({
        title,
        description,
        embedId,
      });
    }),
});
