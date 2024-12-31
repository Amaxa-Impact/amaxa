import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const reportsRouter = createTRPCRouter({
  getReport: protectedProcedure
    .input(z.object({
      id: z.string(),
    })).query(async ({ ctx, input }) => {

    })
})


