import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const actionGuideRouter = createTRPCRouter({
  getActionGuides: publicProcedure
    .input(z.object({
      title: z.string().optional(),
      skillId: z.string().optional(),
    })).query(async ({ input, ctx }) => {
      const { title } = input;
      return await ctx.db.query.guides.findMany({
        where: (guides, { and, ilike }) => and(
          title ? ilike(guides.title, `%${title}%`) : undefined,
        ),
        columns: {
          skills: true
        }
      })
    }),

})
