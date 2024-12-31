import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createEventSchema, Events } from "@amaxa/db/schema";

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
    .input(createEventSchema)
    .mutation(async ({ ctx, input }) => {
      if (!isAdmin(ctx.session))
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You do not have permissions to create an event",
        });
      await ctx.db.insert(Events).values(input);
    }),
});
