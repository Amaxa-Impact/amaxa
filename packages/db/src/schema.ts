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
  role: varchar("role", { length: 30, enum: ["Admin", "User"] })
    .notNull()
    .default("User"),
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

export const Tasks = pgTable("tasks", {
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

export type Task = typeof Tasks.$inferSelect;
export type TaskStatus = Task["status"];

export const TasksRelations = relations(Tasks, ({ one }) => ({
  assignee: one(User, { fields: [Tasks.assigneeId], references: [User.id] }),
  project: one(Projects, {
    fields: [Tasks.projectId],
    references: [Projects.id],
  }),
  parent: one(Tasks, { fields: [Tasks.parentId], references: [Tasks.id] }),
}));

export const Edges = pgTable("edges", {
  id: text("id").primaryKey(),
  source: text("source")
    .references(() => Tasks.id)
    .notNull(),
  target: text("target")
    .references(() => Tasks.id)
    .notNull(),
  projectId: text("project_id").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const EdgesRelations = relations(Edges, ({ one }) => ({
  project: one(Projects, {
    fields: [Edges.projectId],
    references: [Projects.id],
  }),
  source: one(Tasks, {
    fields: [Edges.source],
    references: [Tasks.id],
  }),
  target: one(Tasks, {
    fields: [Edges.target],
    references: [Tasks.id],
  }),
}));

export type Edge = typeof Edges.$inferSelect;

export const createTaskSchema = createInsertSchema(Tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectTaskSchema = createSelectSchema(Tasks);

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

export const ProjectRelations = relations(Projects, ({ one, many }) => ({
  reports: many(Reports),
  tasks: many(Tasks),
  users: many(User),
}));


export type Project = typeof Projects.$inferSelect;

export const createProjectSchema = createInsertSchema(Projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;

export const StatusValues = Tasks.status.enumValues;

export const Project_Tracker = pgTable(
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
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.projectId] }),
  }),
);
export const UserRolesEnum = Project_Tracker.permission.enumValues;

export const ProjectTrackerRelations = relations(
  Project_Tracker,
  ({ one }) => ({
    project: one(Projects, {
      fields: [Project_Tracker.projectId],
      references: [Projects.id],
    }),
    user: one(User, {
      fields: [Project_Tracker.userId],
      references: [User.id],
    }),
  }),
);
export type ProjectTracker = typeof Project_Tracker.$inferSelect;
export type ProjectPermission = ProjectTracker["permission"];

export const Skills = pgTable("skills", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const SkillsRelations = relations(Skills, ({ many }) => ({
  guides: many(SkillsToGuide),
}));

export const SkillsToGuide = pgTable(
  "skills_to_guide",
  {
    skillId: text("skill_id")
      .notNull()
      .references(() => Skills.id),
    guideId: text("guide_id")
      .notNull()
      .references(() => Guides.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.skillId, table.guideId] }),
  }),
);

export const SkillsToGuideRelation = relations(SkillsToGuide, ({ one }) => ({
  skill: one(Skills, {
    fields: [SkillsToGuide.skillId],
    references: [Skills.id],
  }),
  guide: one(Guides, {
    fields: [SkillsToGuide.guideId],
    references: [Guides.id],
  }),
}));

export const Guides = pgTable("guides", {
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

export const GuidesRelations = relations(Guides, ({ many }) => ({
  skills: many(SkillsToGuide),
}));

export const Events = pgTable("events", {
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

export const createEventSchema = createInsertSchema(Events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});


export const Reports = pgTable('report', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  url: text('url').notNull(),
  projectId: text('project_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const ReportRelations = relations(Reports, ({ one }) => ({
  project: one(Projects, {
    fields: [Reports.projectId],
    references: [Projects.id],
  })
}))
