import { z } from "zod";

import { sql } from "@amaxa/db";
import { db } from "@amaxa/db/client";
import { tasks } from "@amaxa/db/schema";

import { next_cache } from "./cache";

const projectIdSchema = z.object({
  projectId: z.string(),
});

export const getTasksOverTime = next_cache(
  (input: z.infer<typeof projectIdSchema>) => {
    const { projectId } = projectIdSchema.parse(input);

    const result = db
      .select({
        month: sql<string>`to_char(${tasks.createdAt}, 'Month')`,
        tasksFinished: sql<number>`count(*)`,
      })
      .from(tasks)
      .where(sql`${tasks.projectId} = ${projectId}`)
      .groupBy(sql`to_char(${tasks.createdAt}, 'Month')`)
      .orderBy(sql`to_char(${tasks.createdAt}, 'Month')`);

    return result;
  },
  ["getTasksOverTime"],
  { revalidate: 3600 }, // Cache for 1 hour
);

// Function to get task priorities
export const getTaskPriorities = next_cache(
  (input: z.infer<typeof projectIdSchema>) => {
    const { projectId } = projectIdSchema.parse(input);

    const result = db
      .select({
        priority: tasks.priority,
        count: sql<number>`count(*)`,
      })
      .from(tasks)
      .where(sql`${tasks.projectId} = ${projectId}`)
      .groupBy(tasks.priority);

    return result;
  },
  ["getTaskPriorities"],
  { revalidate: 3600 }, // Cache for 1 hour
);

// Function to get task statuses
export const getTaskStatuses = next_cache(
  (input: z.infer<typeof projectIdSchema>) => {
    const { projectId } = projectIdSchema.parse(input);

    const result = db
      .select({
        status: tasks.status,
        count: sql<number>`count(*)`,
      })
      .from(tasks)
      .where(sql`${tasks.projectId} = ${projectId}`)
      .groupBy(tasks.status);

    return result;
  },
  ["getTaskStatuses"],
  { revalidate: 3600 }, // Cache for 1 hour
);
