import type { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  status: varchar("status", {
    length: 30,
    enum: ["Verified", "Unverified", "Pending"],
  }),
  role: varchar("role", { length: 30, enum: ["Admin", "User"] })
    .notNull()
    .default("User"),
});

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  tasks: many(tasks),
  projects: many(project_tracker),
}));

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
export const tasks = pgTable("tasks", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  title: varchar("title", { length: 128 }).notNull(),
  parentId: text("parent_id").notNull(),
  description: text("description").notNull(),
  projectId: text("project_id").notNull(),
  doneBy: timestamp("done_by").notNull(),
  assigneeId: text("assignee").notNull(),
  status: varchar("status", {
    length: 30,
    enum: ["todo", "in-progress", "done", "unable-to-complete"],
  })
    .notNull()
    .default("todo"),
  label: varchar("label", {
    length: 30,
    enum: ["bug", "feature", "enhancement", "documentation"],
  })
    .notNull()
    .default("bug"),
  priority: varchar("priority", {
    length: 30,
    enum: ["low", "medium", "high"],
  })
    .notNull()
    .default("low"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  type: text("node_type").notNull().default("custom"),
  position: jsonb("position")
    .$type<{
      x: number;
      y: number;
    }>()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
});

export type Task = typeof tasks.$inferSelect;
export type TaskStatus = Task["status"];

export const tasksRelations = relations(tasks, ({ one }) => ({
  assignee: one(user, { fields: [tasks.assigneeId], references: [user.id] }),
  project: one(Projects, {
    fields: [tasks.projectId],
    references: [Projects.id],
  }),
  parent: one(tasks, { fields: [tasks.parentId], references: [tasks.id] }),
}));

export const edges = pgTable("edges", {
  id: text("id").primaryKey(),
  source: text("source")
    .references(() => tasks.id)
    .notNull(),
  target: text("target")
    .references(() => tasks.id)
    .notNull(),
  projectId: text("project_id").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const edgesRelations = relations(edges, ({ one }) => ({
  project: one(Projects, {
    fields: [edges.projectId],
    references: [Projects.id],
  }),
  source: one(tasks, {
    fields: [edges.source],
    references: [tasks.id],
  }),
  target: one(tasks, {
    fields: [edges.target],
    references: [tasks.id],
  }),
}));

export type Edge = typeof edges.$inferSelect;

export const createTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectTaskSchema = createSelectSchema(tasks);

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type TaskSchema = z.infer<typeof selectTaskSchema>;

export const Projects = pgTable("projects", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export type Project = typeof Projects.$inferSelect;

export const createProjectSchema = createInsertSchema(Projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;

export const statusValues = tasks.status.enumValues;

export const project_tracker = pgTable(
  "project_tracker",
  {
    userId: text("user_id").notNull(),
    projectId: text("project_id").notNull(),
    permission: varchar("permissions", {
      length: 30,
      enum: ["admin", "coach", "student"],
    }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.projectId] })],
);
export const userRolesEnum = project_tracker.permission.enumValues;

export const projectTrackerRelations = relations(
  project_tracker,
  ({ one }) => ({
    project: one(Projects, {
      fields: [project_tracker.projectId],
      references: [Projects.id],
    }),
    user: one(user, {
      fields: [project_tracker.userId],
      references: [user.id],
    }),
  }),
);
export type ProjectTracker = typeof project_tracker.$inferSelect;
export type ProjectPermission = ProjectTracker["permission"];

export const skills = pgTable("skills", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const skillsRelations = relations(skills, ({ many }) => ({
  guides: many(skillsToGuide),
}));

export const skillsToGuide = pgTable(
  "skills_to_guide",
  {
    skillId: text("skill_id")
      .notNull()
      .references(() => skills.id),
    guideId: text("guide_id")
      .notNull()
      .references(() => guides.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (table) => [primaryKey({ columns: [table.skillId, table.guideId] })],
);

export const skillsToGuideRelations = relations(skillsToGuide, ({ one }) => ({
  skill: one(skills, {
    fields: [skillsToGuide.skillId],
    references: [skills.id],
  }),
  guide: one(guides, {
    fields: [skillsToGuide.guideId],
    references: [guides.id],
  }),
}));

export const guides = pgTable("guides", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title"),
  description: text("description").notNull(),
  embedId: text("embed_id"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const guidesRelations = relations(guides, ({ many }) => ({
  skills: many(skillsToGuide),
}));

export const events = pgTable("events", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 256 }).notNull(),
  time: timestamp("date")
    .default(sql`now()`)
    .notNull(),
  isVirtual: boolean("boolean").default(false).notNull(),
  desc: text("description").notNull().notNull(),
  image: text("image").notNull().default("https://placehold.co/600x400"),
  isPublic: boolean("is_public").notNull().default(false),
  registrationLink: text("registration_link").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const createEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
