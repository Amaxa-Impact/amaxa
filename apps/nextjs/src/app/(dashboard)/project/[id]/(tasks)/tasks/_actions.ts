"use server";

import { z } from "zod";

import type { TaskStatus } from "@amaxa/db/schema";
import { auth } from "@amaxa/auth";
import { buildConflictUpdateColumns } from "@amaxa/db";
import { db } from "@amaxa/db/client";
import { Edges, Tasks } from "@amaxa/db/schema";

const schema = z.object({
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
        status: z.string(),
        description: z.string(),
        assigne: z.object({
          id: z.string().default("unassigned"),
          name: z.string().nullable(),
          image: z.string().nullable(),
        }), // Allow null for the entire assigne object
        assigneName: z.string().nullable(),
        projectId: z.string(),
        parent: z
          .object({
            id: z.string(),
          })
          .nullable(), // Make parent nullable
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
  projectId: z.string(),
});

type InputProps = z.infer<typeof schema>;

export async function saveTasks(data: InputProps) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("User is not authenticated");
    }
    // Validate input data
    const validatedData = schema.parse(data);

    const formattedTasks = validatedData.tasks.map((task) => {
      console.log("Task status:", task.data.status);
      return {
        id: task.id,
        type: task.type, // Provide a default value if type is undefined
        title: task.data.title,
        parentId: task.parentId ?? "noid", // Use null if parentId is undefined
        status: task.data.status as TaskStatus,
        description: task.data.description,
        position: task.position,
        projectId: task.data.projectId,
        assigneeId: task.data.assigne.id,
        doneBy: task.data.doneBy,
      };
    });
    // Insert or update tasks
    await db
      .insert(Tasks)
      .values(formattedTasks)
      .onConflictDoUpdate({
        target: Tasks.id,
        set: buildConflictUpdateColumns(Tasks, [
          "title",
          "parentId",
          "description",
          "projectId",
          "doneBy",
          "assigneeId",
          "status",
          "label",
          "priority",
          "type",
          "position",
        ]),
      });

    // Insert or update edges
    await db
      .insert(Edges)
      .values(validatedData.edges)
      .onConflictDoUpdate({
        target: Edges.id,
        set: buildConflictUpdateColumns(Edges, [
          "source",
          "target",
          "projectId",
          "id",
        ]),
      });

    console.log("Tasks and edges saved successfully");
  } catch (error) {
    console.error("Error in saveTasks:", error);
    throw new Error("Failed to save tasks and edges");
  }
}
