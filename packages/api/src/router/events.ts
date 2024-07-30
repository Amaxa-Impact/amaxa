import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { createEventSchema, events } from "@amaxa/db/schema";

export const eventsRouter = createTRPCRouter({
  all: publicProcedure
    .input(z.object({
      name: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { name } = input;
      return await ctx.db.query.events.findMany({
        where: (events, {
          and,
          ilike
        }) => and(
          name ? ilike(events.name, name) : undefined
        )
      })
    }),
  create: protectedProcedure
    .input(createEventSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(events).values(input)
    }),
})
