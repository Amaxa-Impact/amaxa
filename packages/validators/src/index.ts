import { type } from "arktype";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-arktype";

import {
  account,
  edges,
  events,
  guides,
  project_tracker,
  Projects,
  session,
  skills,
  skillsToGuide,
  tasks,
  user,
  verification,
} from "@amaxa/db/schema";

// Assuming your schema path

export const role = "'User' | 'Admin'";
export const userRoles = "'admin' | 'coach' | 'student'";
// User Schemas
export const userSelectSchema = createSelectSchema(user);
export const userInsertSchema = createInsertSchema(user);
export const userUpdateSchema = createUpdateSchema(user, {
  id: type.string, // Make PK required for update
});

// Session Schemas
export const sessionSelectSchema = createSelectSchema(session);
export const sessionInsertSchema = createInsertSchema(session);
export const sessionUpdateSchema = createUpdateSchema(session, {
  id: type.string, // Make PK required for update
});

// Account Schemas
export const accountSelectSchema = createSelectSchema(account);
export const accountInsertSchema = createInsertSchema(account);
export const accountUpdateSchema = createUpdateSchema(account, {
  id: type.string, // Make PK required for update
});

// Verification Schemas
export const verificationSelectSchema = createSelectSchema(verification);
export const verificationInsertSchema = createInsertSchema(verification);
export const verificationUpdateSchema = createUpdateSchema(verification, {
  id: type.string, // Make PK required for update
});

// Tasks Schemas
// Correctly define the object schema using `type`
const positionSchema = type({ x: "number", y: "number" });
export const tasksSelectSchema = createSelectSchema(tasks, {
  position: positionSchema, // Refine JSON type
});
export const tasksInsertSchema = createInsertSchema(tasks, {
  position: positionSchema, // Refine JSON type
});
export const tasksUpdateSchema = createUpdateSchema(tasks, {
  id: type.string, // Make PK required for update
  position: positionSchema, // Refine JSON type
});

// Edges Schemas
export const edgesSelectSchema = createSelectSchema(edges);
export const edgesInsertSchema = createInsertSchema(edges);
export const edgesUpdateSchema = createUpdateSchema(edges, {
  id: type.string, // Make PK required for update
});

// Projects Schemas
export const projectsSelectSchema = createSelectSchema(Projects);
export const projectsInsertSchema = createInsertSchema(Projects);
export const projectsUpdateSchema = createUpdateSchema(Projects, {
  id: type.string, // Make PK required for update
});

// Project Tracker Schemas
export const projectTrackerSelectSchema = createSelectSchema(project_tracker);
export const projectTrackerInsertSchema = createInsertSchema(project_tracker);
export const projectTrackerUpdateSchema = createUpdateSchema(project_tracker, {
  // Make composite PK required for update
  userId: type.string,
  projectId: type.string,
});

// Skills Schemas
export const skillsSelectSchema = createSelectSchema(skills);
export const skillsInsertSchema = createInsertSchema(skills);
export const skillsUpdateSchema = createUpdateSchema(skills, {
  id: type.string, // Make PK required for update
});

// SkillsToGuide Schemas
export const skillsToGuideSelectSchema = createSelectSchema(skillsToGuide);
export const skillsToGuideInsertSchema = createInsertSchema(skillsToGuide);
export const skillsToGuideUpdateSchema = createUpdateSchema(skillsToGuide, {
  // Make composite PK required for update
  skillId: type.string,
  guideId: type.string,
});

// Guides Schemas
export const guidesSelectSchema = createSelectSchema(guides);
export const guidesInsertSchema = createInsertSchema(guides);
export const guidesUpdateSchema = createUpdateSchema(guides, {
  id: type.string, // Make PK required for update
});

// Events Schemas
export const eventsSelectSchema = createSelectSchema(events);
export const eventsInsertSchema = createInsertSchema(events);
export const eventsUpdateSchema = createUpdateSchema(events, {
  id: type.string, // Make PK required for update
});

// Example Usage (Illustrative)
/*
import { db } from './db'; // Your drizzle instance
import { eq } from 'drizzle-orm'; // Import eq for where clauses

async function createUser(data: typeof userInsertSchema.infer) {
  const parsed = userInsertSchema(data);
  // Use .problems for checking errors with ArkType v2+
  if (parsed.problems) {
    throw new Error(parsed.problems.summary);
  }
  // Use .data to get the validated data
  return await db.insert(user).values(parsed.data).returning();
}

async function getUser(id: string) {
  const result = await db.select().from(user).where(eq(user.id, id)).limit(1);
  if (!result.length) return null; // Handle not found

  const parsed = userSelectSchema(result[0]);
   if (parsed.problems) {
    // Handle potential mismatch between query and schema if not selecting all fields
    console.error("Select schema validation failed:", parsed.problems.summary);
    // Depending on your needs, you might return the raw result or null/error
    return null;
  }
  return parsed.data;
}

async function updateUser(data: typeof userUpdateSchema.infer) {
 const parsed = userUpdateSchema(data);
  if (parsed.problems) {
    throw new Error(parsed.problems.summary);
  }
  // Destructure from parsed.data
  const { id, ...updateData } = parsed.data;
  return await db.update(user).set(updateData).where(eq(user.id, id)).returning();
}
*/

// Define the schema for a single task object
const taskSchemaDefinition = type({
  id: "string",
  "type?": "string", // Optional key for 'type'
  parentId: "string",
  position: {
    x: "number",
    y: "number",
  },
  data: {
    title: "string",
    status: "string",
    description: "string",
    assigne: {
      id: "string",
      name: "string | null", // Nullable string
      image: "string | null", // Nullable string
    },
    assigneName: "string | null", // Nullable string
    projectId: "string",
    parent: {
      // Nested object for parent reference
      id: "string",
    },
    doneBy: "Date", // ArkType keyword for Date objects
  },
});

// Define the schema for a single edge object
const edgeSchemaDefinition = type({
  id: "string",
  projectId: "string",
  source: "string",
  target: "string",
});

// Define the main schema using the task and edge definitions
export const flowDataSchema = type({
  projectId: "string",
  tasks: taskSchemaDefinition.array(),
  edges: edgeSchemaDefinition.array(),
});
export type FlowData = typeof flowDataSchema.infer;
