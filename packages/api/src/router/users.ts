import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { eq } from "@amaxa/db";
import { project_tracker, Projects, User } from "@amaxa/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  usersNotInProject: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.db
      .select({
        id: User.id,
        name: User.name,
      })
      .from(User);
  }),
  joinProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        userId: z.string(),
        permission: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { projectId, permission, userId } = input;
      if (
        ctx.session.user.role != "Admin" ||
        ctx.session.user.project_permissions?.[input.projectId] != "Admin" ||
        ctx.session.user.project_permissions?.[input.projectId] != "Coach"
      ) {
        return new TRPCError({
          message: "You do not have permissions to update user permissions",
          code: "UNAUTHORIZED",
        });
      }

      await ctx.db.insert(project_tracker).values({
        userId,
        projectId,
        permission,
      });
    }),

  findUsersForProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select({
          id: User.id,
          name: User.name,
          image: User.image,
          role: project_tracker.permission,
        })
        .from(project_tracker)
        .where(eq(project_tracker.projectId, input.projectId))
        .innerJoin(User, eq(User.id, project_tracker.userId));
    }),
});
