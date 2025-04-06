import { type } from "arktype";
import { z } from "zod";

import { and, eq } from "@amaxa/db";
import { project_tracker, user } from "@amaxa/db/schema";
import { userUpdateSchema } from "@amaxa/validators";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  usersNotInProject: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.db
      .select({
        id: user.id,
        name: user.name,
      })
      .from(user);
  }),
  joinProject: protectedProcedure
    .input(
      type({
        projectId: type.string,
        userId: type.string,
        permission: "'admin' | 'coach' | 'student'",
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { projectId, permission, userId } = input;
      const parsed = permission;
      await ctx.db.insert(project_tracker).values({
        userId,
        projectId,
        permission: parsed,
      });
    }),

  findusersForProject: publicProcedure
    .input(
      type({
        projectId: type.string,
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select({
          id: user.id,
          name: user.name,
          image: user.image,
          email: user.email,
          role: project_tracker.permission,
        })
        .from(project_tracker)
        .where(eq(project_tracker.projectId, input.projectId))
        .innerJoin(user, eq(user.id, project_tracker.userId));
    }),
  updateProjectStatus: protectedProcedure
    .input(
      type({
        projectId: "string",
        userId: "string",
        permission: "'admin' | 'coach' | 'student'",
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, projectId, permission } = input;
      return await ctx.db
        .update(project_tracker)
        .set({
          permission: permission as "admin" | "coach" | "student",
        })
        .where(
          and(
            eq(project_tracker.userId, userId),
            eq(project_tracker.projectId, projectId),
          ),
        );
    }),
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(user);
  }),

  updateUser: protectedProcedure
    .input(userUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(user)
        .set(input)
        .where(eq(user.id, input.id))
        .returning();
    }),

  deleteuser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(user).where(eq(user.id, input.id));
    }),
});
