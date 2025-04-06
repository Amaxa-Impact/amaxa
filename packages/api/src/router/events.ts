import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { events } from "@amaxa/db/schema";
import { eventsInsertSchema } from "@amaxa/validators";

import { isAdmin } from "../permissions";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const eventsRouter = createTRPCRouter({
  all: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { name } = input;
      return await ctx.db.query.events.findMany({
        where: (events, { and, ilike }) =>
          and(name ? ilike(events.name, name) : undefined),
      });
    }),
  create: protectedProcedure
    .input(eventsInsertSchema)
    .mutation(async ({ ctx, input }) => {
      if (!isAdmin(ctx.session))
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You do not have permissions to create an event",
        });
      await ctx.db.insert(events).values(input);
    }),
});
