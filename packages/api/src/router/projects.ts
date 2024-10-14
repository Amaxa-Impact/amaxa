// import { and, ilike } from "@amaxa/db";
// import { Projects } from "@amaxa/db/schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { eq } from "@amaxa/db";
import { createProjectSchema, Projects } from "@amaxa/db/schema";

import { isAdmin, isProjectPrivileged } from "../permissions";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const projectsRouter = createTRPCRouter({
  findAll: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
      }),
    )
    .query(async ({ ctx }) => {
      return await ctx.db.query.Projects.findMany({});
    }),
  create: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ ctx, input }) => {
      if (!isAdmin(ctx.session))
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You do not have permissions to create a project",
        });
      await ctx.db.insert(Projects).values(input);
    }),
  forDashboard: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;

      return await ctx.db.query.Projects.findFirst({
        where: (Projects, { eq }) => eq(Projects.id, id),
        columns: {
          id: true,
          name: true,
          description: true,
          image: true,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...update } = input;
      if (!isProjectPrivileged(input.id, ctx.session))
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You do not have permissions to update this project",
        });
      await ctx.db.update(Projects).set(update).where(eq(Projects.id, id));
    }),
});
