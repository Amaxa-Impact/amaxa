"use server"
import { db } from "@amaxa/db/client";
import { buildConflictUpdateColumns } from "@amaxa/db";
import { edges, tasks } from "@amaxa/db/schema";
import { z } from "zod";

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
          id: z.string(),
          name: z.string().nullable(),
          image: z.string().nullable(),
        }),  // Allow null for the entire assigne object
        assigneName: z.string().nullable(),
        projectId: z.string(),
        parent: z.object({
          id: z.string(),
        }).nullable(),  // Make parent nullable
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
})

type InputProps = z.infer<typeof schema>;

export async function saveTasks(data: InputProps) {
  try {
    // Validate input data
    const validatedData = schema.parse(data);

    const formattedTasks = validatedData.tasks.map((task) => {
      console.log("Task:", task)
      return {
        id: task.id,
        type: task.type ?? 'task',  // Provide a default value if type is undefined
        title: task.data.title,
        parentId: task.parentId ?? "noid",  // Use null if parentId is undefined
        description: task.data.description,
        position: task.position,
        projectId: task.data.projectId,
        assigneeId: task.data.assigne?.id ?? 'unassigned',
        doneBy: task.data.doneBy,
      }
    });

    // Insert or update tasks
    await db
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
    await db.insert(edges).values(validatedData.edges).onConflictDoUpdate({
      target: edges.id,
      set: buildConflictUpdateColumns(edges, ["source", "target", "projectId", "id"]),
    });

    console.log("Tasks and edges saved successfully");
  } catch (error) {
    console.error("Error in saveTasks:", error);
    throw new Error("Failed to save tasks and edges");
  }
}
