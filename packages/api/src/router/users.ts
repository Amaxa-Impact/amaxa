import { TRPCRouterRecord } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { project_tracker, User } from "@amaxa/db/schema";
import { and, eq, isNull } from "@amaxa/db";



export const userRouter = createTRPCRouter({
  usersNotInProject: protectedProcedure
    .input(z.object({
      projectId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { projectId } = input;

      return await ctx.db
        .select({
          id: User.id,
          name: User.name,
          email: User.email,
        })
        .from(User)
        .leftJoin(project_tracker, eq(User.id, project_tracker.userId))
        .where(
          and(
            eq(project_tracker.projectId, projectId),
            isNull(project_tracker.userId)
          )
        );
    })
}) 
