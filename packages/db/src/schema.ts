import type { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { Permission } from "./perms";

export const User = pgTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  isPublic: boolean("is_public").notNull().default(true),
  status: varchar("status", {
    length: 30,
    enum: ["Verified", "Unverified", "Pending"],
  })
    .notNull()
    .default("Unverified"),
  role: varchar("role", { length: 30, enum: ["Admin", "Coach", "Student"] })
    .notNull()
    .default("Student"),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    withTimezone: true,
  }),
  image: varchar("image", { length: 255 }),
});

export type User = typeof User.$inferSelect;
export type UserStatus = User["status"];
export type UserRole = User["role"];

export const UserRelations = relations(User, ({ many }) => ({
  accounts: many(Account),
}));

export const Account = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<"email" | "oauth" | "oidc" | "webauthn">()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const AccountRelations = relations(Account, ({ one }) => ({
  user: one(User, { fields: [Account.userId], references: [User.id] }),
}));

export const Session = pgTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  expires: timestamp("expires", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
});

export const SessionRelations = relations(Session, ({ one }) => ({
  user: one(User, { fields: [Session.userId], references: [User.id] }),
}));

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
  assignee: one(User, { fields: [tasks.assigneeId], references: [User.id] }),
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
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;

export const statusValues = tasks.status.enumValues;

export const project_tracker = pgTable("project_tracker", {
  userId: text("user_id").notNull(),
  projectId: text("project_id").notNull(),
  permission: text("permissions").array().notNull().$type<Permission[]>(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.projectId] }),
}));


export const projectTrackerRelations = relations(project_tracker, ({ one }) => ({
  project: one(Projects, {
    fields: [project_tracker.projectId],
    references: [Projects.id],
  }),
  user: one(User, { fields: [project_tracker.userId], references: [User.id] }),
}));
export type ProjectTracker = typeof project_tracker.$inferSelect;
export type ProjectPermission = ProjectTracker["permission"];

const typeOfGuide = [
  'fundraising',
]

export const guides = pgTable("guides", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name"),
  type: text("type").array().$type<typeof typeOfGuide[number][]>(),
  embedId: text("embed_id"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
})

export const events = pgTable("events", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: varchar("name", { length: 256 }).notNull(),
  time: timestamp("date").default(sql`now()`).notNull(),
  isVirtual: boolean("boolean").default(false).notNull(),
  desc: text("description").notNull().notNull(),
  image: text("image").notNull().default("https://placehold.co/600x400"),
  isPublic: boolean("is_public").notNull().default(false),
  registrationLink: text("registration_link").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
})

export const createEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
