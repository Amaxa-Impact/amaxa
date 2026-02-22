export const TEST_USERS = {
  SITE_ADMIN: {
    id: "user_01KEYZVBEHVT7H0NKMK3A3G10C",
    email: "admin.test@amaxaimpact.org",
    name: "Site Admin",
  },

  SITE_COACH: {
    id: "user_01KEYZYZFW81C7P5JJKK0S3KD0",
    email: "coach.test@test.amaxaimpact.org",
    name: "Site Coach",
  },

  WORKSPACE_ADMIN: {
    id: "user_01KFC1ERNZ4T5PCY3MQ8AZ9QRJ",
    email: "workspace-admin.test@test.amaxaimpact.org",
    name: "Workspace Admin",
  },

  PROJECT_MEMBER: {
    id: "user_01KEZ02VF82SSCN8P7FA8XRTGJ",
    email: "member.test@test.amaxaimpact.org",
    name: "Project Member",
  },

  UNASSIGNED_USER: {
    id: "user_01KEZ03RBXD8VJ21089B29EQ24",
    email: "user.test@test.amaxaimpact.org",
    name: "Unassigned User",
  },
} as const;

export type TestUserKey = keyof typeof TEST_USERS;

export type TestUser = (typeof TEST_USERS)[TestUserKey];

export function getTestUser(key: TestUserKey): TestUser {
  return TEST_USERS[key];
}

export function createIdentity(user: TestUser) {
  return {
    subject: user.id,
    email: user.email,
    name: user.name,
    issuer: "https://test.amaxaimpact.org",
    tokenIdentifier: `https://test.amaxaimpact.org|${user.id}`,
  };
}

export const TEST_WORKSPACE = {
  slug: "e2e-test-workspace",
  name: "E2E Test Workspace",
} as const;

export const TEST_PROJECT = {
  name: "E2E Test Project",
  description: "Project for automated testing",
} as const;
