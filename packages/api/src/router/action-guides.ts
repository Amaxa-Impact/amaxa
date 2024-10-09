import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { guides } from "@amaxa/db/schema";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const actionGuideRouter = createTRPCRouter({
  getActionGuides: publicProcedure
    .input(
      z.object({
        title: z.string().optional(),
        skillId: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { title } = input;
      return await ctx.db.query.guides.findMany({
        where: (guides, { and, ilike }) =>
          and(title ? ilike(guides.title, `%${title}%`) : undefined),
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        embedId: z.string().url(),
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
      await ctx.db.insert(guides).values({
        title,
        description,
        embedId,
      });
    }),
});
