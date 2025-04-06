import { TRPCError } from "@trpc/server";
import { type } from "arktype";

import { and, buildConflictUpdateColumns, eq, sql } from "@amaxa/db";
import { edges, tasks } from "@amaxa/db/schema";
import {
  flowDataSchema,
  tasksInsertSchema,
  tasksSelectSchema,
  tasksUpdateSchema,
} from "@amaxa/validators";

import { isProjectStudent } from "../permissions";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const tasksRouter = createTRPCRouter({
  getProjectTasks: protectedProcedure
    .input(tasksSelectSchema)
    .query(async ({ ctx, input }) => {
      const { projectId } = input;
      const { tasks, edges } = await ctx.db.transaction(async (tx) => {
        const tasks = await tx.query.tasks.findMany({
          where: (tasks, { eq }) => eq(tasks.projectId, projectId),
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
        type: node.type,
        parentId: node.parentId,
        position: {
          x: node.position.x,
          y: node.position.y,
        },
        data: {
          id: node.id,
          status: node.status,
          title: node.title,
          assigne: node.assignee,
          assigneName: node.assignee.name,
          description: node.description,
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
    .input(flowDataSchema)
    .mutation(async ({ ctx, input }) => {
      if (!isProjectStudent(input.projectId, ctx.session))
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You do not have permissions to create an event",
        });
      const formattedTasks = input.tasks.map((task) => ({
        id: task.id,
        type: task.type,
        title: task.data.title,
        parentId: task.parentId,
        description: task.data.description,
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
            "description",
            "type",
            "title",
            "parentId",
            "projectId",
            "doneBy",
            "assigneeId",
            "status",
            "label",
            "priority",
          ]),
        });

      // Insert or update edges
      await ctx.db
        .insert(edges)
        .values(input.edges)
        .onConflictDoUpdate({
          target: edges.id,
          set: buildConflictUpdateColumns(edges, ["source", "target"]),
        });
    }),
  create: protectedProcedure
    .input(tasksInsertSchema)
    .mutation(async ({ ctx, input }) => {
      if (!isProjectStudent(input.projectId, ctx.session))
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You do not have permissions to create an event",
        });
      await ctx.db.insert(tasks).values(input);
    }),
  update: protectedProcedure
    .input(tasksUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(tasks).set(input).where(eq(tasks.id, input.id));
    }),
  getTaskData: protectedProcedure
    .input(
      type({
        projectId: "string",
      }),
    )
    .query(async ({ ctx, input }) => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const result = await ctx.db
        .select({
          month: sql<string>`to_char(${tasks.createdAt}, 'Month')`,
          tasksFinished: sql<number>`count(*)`,
        })
        .from(tasks)
        .where(
          and(
            eq(tasks.status, "done"),
            sql`${tasks.createdAt} >= ${sixMonthsAgo}`,
            eq(tasks.projectId, input.projectId),
          ),
        )
        .groupBy(sql`to_char(${tasks.createdAt}, 'Month')`)
        .orderBy(sql`min(${tasks.createdAt})`);

      return result;
    }),
  getPriorityData: protectedProcedure
    .input(
      type({
        projectId: "string",
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({
          priority: tasks.priority,
          count: sql<number>`count(*)`,
        })
        .from(tasks)
        .where(eq(tasks.projectId, input.projectId))
        .groupBy(tasks.priority);
      return result;
    }),
  getPositionData: protectedProcedure
    .input(
      type({
        projectId: "string",
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({
          position: tasks.position,
          count: sql<number>`count(*)`,
        })
        .from(tasks)
        .where(eq(tasks.projectId, input.projectId))
        .groupBy(tasks.position);
      return result;
    }),

  getTasksOverTime: protectedProcedure
    .input(type({ projectId: "string" }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({
          month: sql<string>`to_char(${tasks.createdAt}, 'Month')`,
          tasksFinished: sql<number>`count(*)`,
        })
        .from(tasks)
        .where(eq(tasks.projectId, input.projectId))
        .groupBy(sql`to_char(${tasks.createdAt}, 'Month')`)
        .orderBy(sql`to_char(${tasks.createdAt}, 'Month')`);

      return result;
    }),

  getTaskPriorities: protectedProcedure
    .input(type({ projectId: "string" }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({
          priority: tasks.priority,
          count: sql<number>`count(*)`,
        })
        .from(tasks)
        .where(eq(tasks.projectId, input.projectId))
        .groupBy(tasks.priority);

      return result;
    }),

  getTaskStatuses: protectedProcedure
    .input(type({ projectId: "string" }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({
          status: tasks.status,
          count: sql<number>`count(*)`,
        })
        .from(tasks)
        .where(eq(tasks.projectId, input.projectId))
        .groupBy(tasks.status);

      return result;
    }),
});
