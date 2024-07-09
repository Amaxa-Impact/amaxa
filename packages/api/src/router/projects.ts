import { and, ilike } from "@amaxa/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { Projects } from "@amaxa/db/schema";

export const projectsRouter = createTRPCRouter({
  findAll: protectedProcedure
    .input(z.object({
      name: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      const { name } = input
      const condition = and(
        input.name != undefined ? ilike(Projects.name, name!) : undefined
      )
      return await ctx.db.query.Projects.findMany({
        where: condition
      })
    })
}) 
