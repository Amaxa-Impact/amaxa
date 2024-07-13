// import { and, ilike } from "@amaxa/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { type CreateProjectSchema, Projects, createProjectScreateProjectSchema } from "@amaxa/db/schema"
// import { Projects } from "@amaxa/db/schema";

export const projectsRouter = createTRPCRouter({
  findAll: publicProcedure
    .input(z.object({
      name: z.string().optional(),
    }))
    .query(async ({ ctx }) => {
      return await ctx.db.query.Projects.findMany({
      })
    }),
  create: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(Projects).values(input)
    })
}) 
