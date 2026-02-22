import { convexTest } from "convex-test";

import type { Id } from "../_generated/dataModel";
import schema from "../schema";
import { createIdentity, TEST_USERS } from "./test.users";

export function createTestContext() {
  return convexTest(schema);
}

export type TestContext = ReturnType<typeof createTestContext>;

export type AuthenticatedTestContext = ReturnType<TestContext["withIdentity"]>;

export function setupTestUsers(t: TestContext) {
  return {
    asSiteAdmin: t.withIdentity(createIdentity(TEST_USERS.SITE_ADMIN)),
    asSiteCoach: t.withIdentity(createIdentity(TEST_USERS.SITE_COACH)),
    asWorkspaceAdmin: t.withIdentity(
      createIdentity(TEST_USERS.WORKSPACE_ADMIN),
    ),
    asProjectMember: t.withIdentity(createIdentity(TEST_USERS.PROJECT_MEMBER)),
    asUnassignedUser: t.withIdentity(
      createIdentity(TEST_USERS.UNASSIGNED_USER),
    ),
  };
}

export async function seedSiteRoles(t: TestContext) {
  await t.run(async (ctx) => {
    await ctx.db.insert("siteUser", {
      userId: TEST_USERS.SITE_ADMIN.id,
      role: "admin",
    });

    await ctx.db.insert("siteUser", {
      userId: TEST_USERS.SITE_COACH.id,
      role: "coach",
    });
  });
}

export async function seedTestWorkspace(t: TestContext) {
  const workspaceId = await t.run(async (ctx) => {
    const id = await ctx.db.insert("workspaces", {
      name: "E2E Test Workspace",
      slug: "e2e-test-workspace",
      createdBy: TEST_USERS.WORKSPACE_ADMIN.id,
      createdAt: Date.now(),
    });

    await ctx.db.insert("workspaceToUser", {
      workspaceId: id,
      userId: TEST_USERS.WORKSPACE_ADMIN.id,
      role: "owner",
    });

    return id;
  });

  return workspaceId;
}

export async function setupTestEnvironment(t: TestContext) {
  await seedSiteRoles(t);

  const workspaceId = await seedTestWorkspace(t);

  const users = setupTestUsers(t);

  return {
    ...users,
    workspaceId,
    testUsers: TEST_USERS,
  };
}

export interface MockUser {
  subject: string;
  email?: string;
  name?: string;
}

export function createMockUser(overrides: Partial<MockUser> = {}): MockUser {
  const id = Math.random().toString(36).substring(7);
  return {
    subject: `user_${id}`,
    email: `test-${id}@example.com`,
    name: `Test User ${id}`,
    ...overrides,
  };
}

export interface WorkspaceFactoryInput {
  name?: string;
  slug?: string;
  createdBy?: string;
}

export async function createTestWorkspace(
  t: TestContext,
  input: WorkspaceFactoryInput = {},
) {
  const id = Math.random().toString(36).substring(7);
  const defaults = {
    name: `Test Workspace ${id}`,
    slug: `test-workspace-${id}`,
    createdBy: `user_${id}`,
    createdAt: Date.now(),
  };

  const workspaceData = {
    ...defaults,
    ...input,
  };

  const workspaceId = await t.run(async (ctx) => {
    return await ctx.db.insert("workspaces", workspaceData);
  });

  return {
    workspaceId,
    ...workspaceData,
  };
}

export interface WorkspaceMembershipInput {
  workspaceId: Id<"workspaces">;
  userId: string;
  role?: "owner" | "admin" | "member";
}

export async function createTestWorkspaceMembership(
  t: TestContext,
  input: WorkspaceMembershipInput,
) {
  const membershipId = await t.run(async (ctx) => {
    return await ctx.db.insert("workspaceToUser", {
      workspaceId: input.workspaceId,
      userId: input.userId,
      role: input.role ?? "member",
    });
  });

  return {
    membershipId,
    workspaceId: input.workspaceId,
    userId: input.userId,
    role: input.role ?? "member",
  };
}

export interface ProjectFactoryInput {
  name?: string;
  description?: string;
  workspaceId?: Id<"workspaces">;
}

export async function createTestProject(
  t: TestContext,
  input: ProjectFactoryInput = {},
) {
  const id = Math.random().toString(36).substring(7);
  const defaults = {
    name: `Test Project ${id}`,
    description: `Description for test project ${id}`,
  };

  const projectData = {
    ...defaults,
    ...input,
  };

  const projectId = await t.run(async (ctx) => {
    return await ctx.db.insert("projects", projectData);
  });

  return {
    projectId,
    ...projectData,
  };
}

export async function createTestSiteAdmin(t: TestContext, userId?: string) {
  const id = userId ?? `user_${Math.random().toString(36).substring(7)}`;

  const siteUserId = await t.run(async (ctx) => {
    return await ctx.db.insert("siteUser", {
      userId: id,
      role: "admin",
    });
  });

  return {
    siteUserId,
    userId: id,
    role: "admin" as const,
  };
}

export async function createTestSiteCoach(t: TestContext, userId?: string) {
  const id = userId ?? `user_${Math.random().toString(36).substring(7)}`;

  const siteUserId = await t.run(async (ctx) => {
    return await ctx.db.insert("siteUser", {
      userId: id,
      role: "coach",
    });
  });

  return {
    siteUserId,
    userId: id,
    role: "coach" as const,
  };
}

export async function createTestWorkspaceWithOwner(
  t: TestContext,
  input: WorkspaceFactoryInput = {},
) {
  const ownerId =
    input.createdBy ?? `user_${Math.random().toString(36).substring(7)}`;

  const workspace = await createTestWorkspace(t, {
    ...input,
    createdBy: ownerId,
  });

  const membership = await createTestWorkspaceMembership(t, {
    workspaceId: workspace.workspaceId,
    userId: ownerId,
    role: "owner",
  });

  return {
    workspace,
    owner: {
      userId: ownerId,
      membership,
    },
  };
}

export async function addMemberToWorkspace(
  t: TestContext,
  workspaceId: Id<"workspaces">,
  role: "owner" | "admin" | "member" = "member",
) {
  const userId = `user_${Math.random().toString(36).substring(7)}`;

  const membership = await createTestWorkspaceMembership(t, {
    workspaceId,
    userId,
    role,
  });

  return {
    userId,
    membership,
  };
}
