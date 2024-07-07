import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const User = pgTable("user", {
  id: text("id").notNull().primaryKey().$defaultFn(() => createId()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    withTimezone: true,
  }),
  image: varchar("image", { length: 255 }),
});

export const UserRelations = relations(User, ({ many }) => ({
  accounts: many(Account),
}));

export const Account = pgTable(
  "account",
  {
    userId: uuid("userId")
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
  userId: uuid("userId")
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


export const StatusEnum = pgEnum(`status`, [
  "todo",
  "in-progress",
  "done",
  "canceled",
])

export const LabelEnum = pgEnum(`label`, [
  "bug",
  "feature",
  "enhancement",
  "documentation",
])

export const PriorityEnum = pgEnum(`priority`, [
  "low",
  "medium",
  "high",
])

export const tasks = pgTable("tasks", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  code: varchar("code", { length: 255 }).unique(),
  type: text("node_type").notNull().default("custom"),
  projectId: integer("project_id").notNull(),
  title: varchar("title", { length: 255 }),
  status: StatusEnum("status").notNull().default("todo"),
  label: LabelEnum("label").notNull().default("bug"),
  assigneId: varchar("assigneId", { length: 255 }),
  parentId: text("parent_id"),
  priority: PriorityEnum("priority").notNull().default("low"),
  actionGuideId: integer("action_guide_id"),
  position: jsonb('position').$type<{
    x: number,
    y: number
  }>(),

})

export type TaskType = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
