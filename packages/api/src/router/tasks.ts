import { z } from "zod";

import { buildConflictUpdateColumns, eq } from "@amaxa/db";
import { edges, statusValues, tasks } from "@amaxa/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const tasksRouter = createTRPCRouter({
  getProjectTasks: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { projectId } = input;
      const { tasks, edges } = await ctx.db.transaction(async (tx) => {
        const tasks = await tx.query.tasks.findMany({
          where: (tasks, { eq }) => eq(tasks.id, projectId),
          with: {
            assignee: {
              columns: {
                id: true,
                name: true,
                image: true,
              },
            },
            parent: {
              columns: {
                id: true,
              },
            },
          },
        });

        const edges = await tx.query.edges.findMany({
          where: (edges, { eq }) => eq(edges.projectId, projectId),
        });

        return {
          tasks,
          edges,
        };
      });

      const formattedNodes = tasks.map((node) => ({
        id: node.id,
        type: node.type!,
        parentId: node.parent.id,
        position: {
          x: node.position?.x,
          y: node.position?.y,
        },
        data: {
          id: node.id,
          status: node.status,
          title: node.title,
          assigne: node.assignee!,
          assigneName: node.assignee.name,
          parent: node.parent,
          projectId: node.projectId,
          doneBy: new Date(node.doneBy),
        },
      }));

      return {
        tasks: formattedNodes,
        edges,
      };
    }),

  save: protectedProcedure
    .input(
      z.object({
        tasks: z.array(
          z.object({
            id: z.string(),
            type: z.string().optional(),
            parentId: z.string().optional(),
            position: z.object({
              x: z.number(),
              y: z.number(),
            }),
            data: z.object({
              title: z.string(),
              status: z.enum(statusValues),
              assigne: z.object({
                id: z.string(),
                name: z.string().nullable(),
                image: z.string().nullable(),
              }),
              assigneName: z.string().nullable(),
              projectId: z.string(),
              parent: z.object({
                id: z.string(),
              }),
              doneBy: z.date(),
            }),
          }),
        ),

        edges: z.array(
          z.object({
            id: z.string(),
            projectId: z.string(),
            source: z.string(),
            target: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const formattedTasks = input.tasks.map((task) => ({
        id: task.id,
        type: task.type,
        title: task.data.title,
        parentId: task.parentId,
        position: task.position,
        projectId: task.data.projectId,
        assigneeId: task.data.assigne.id,
        doneBy: task.data.doneBy,
      }));

      // Insert or update tasks
      await ctx.db
        .insert(tasks)
        .values(formattedTasks)
        .onConflictDoUpdate({
          target: tasks.id,
          set: buildConflictUpdateColumns(tasks, [
            "type",
            "position",
            "doneBy",
          ]),
        });

      // Insert or update edges
      await ctx.db.insert(edges).values(input.edges).onConflictDoNothing();
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        projectId: z.string(),
        parentId: z.string(),
        position: z.object({
          x: z.number(),
          y: z.number(),
        }),
        assigneeId: z.string(),
        doneBy: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(tasks).values(input);
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        position: z
          .object({
            x: z.number(),
            y: z.number(),
          })
          .optional(),
        assigneeId: z.string().optional(),
        status: z.enum(statusValues).optional(),
        doneBy: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(tasks).set(input).where(eq(tasks.id, input.id));
    }),
});
