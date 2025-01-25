import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const reportsRouter = createTRPCRouter({
  getReport: protectedProcedure
    .input(z.object({
      id: z.string(),
    })).query(async ({ ctx, input }) => {
      return await ctx.db.query.Reports.findFirst({
        where: (Reports, { eq }) => eq(Reports.id, input.id),
      })
    }),
})


