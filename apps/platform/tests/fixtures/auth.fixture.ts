/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-restricted-properties */
/**
 * Authentication Fixtures for E2E Tests (WorkOS AuthKit)
 *
 * Provides auth state paths and helper functions for testing with different
 * authentication states using WorkOS AuthKit session cookies.
 *
 * BEST PRACTICE: Use storageState instead of calling signIn() in tests.
 * - Tests should use `test.use({ storageState: USER_AUTH_STATE })` to start authenticated
 * - This avoids rate limiting and speeds up test execution
 */

import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Page } from "@playwright/test";
import { test as base, expect } from "@playwright/test";

const env = process.env;

const __dirname = dirname(fileURLToPath(import.meta.url));

const AUTH_STATE_DIR = path.join(__dirname, "../../playwright/.auth");

/**
 * Auth state paths for different user types.
 * Use these with `test.use({ storageState: ... })` to start tests already authenticated.
 */
export const USER_AUTH_STATE = path.join(AUTH_STATE_DIR, "user.json");
export const ADMIN_AUTH_STATE = path.join(AUTH_STATE_DIR, "siteAdmin.json");
export const COACH_AUTH_STATE = path.join(AUTH_STATE_DIR, "projectCoach.json");
export const MEMBER_AUTH_STATE = path.join(
  AUTH_STATE_DIR,
  "projectMember.json",
);

/**
 * Test user credentials for E2E testing.
 *
 * IMPORTANT: Create these test users in WorkOS User Management for your
 * development instance. Never use real user credentials.
 */
export const TEST_USERS = {
  ADMIN: {
    email: env.ADMIN_USER_EMAIL,
    password: env.ADMIN_USER_PASSWORD,
  },
  COACH: {
    email: env.COACH_USER_EMAIL,
    password: env.COACH_USER_PASSWORD,
  },
  MEMBER: {
    email: env.MEMBER_USER_EMAIL,
    password: env.MEMBER_USER_PASSWORD,
  },
  USER: {
    email: env.USER_EMAIL,
    password: env.USER_PASSWORD,
  },
} as const;

export type TestUser = (typeof TEST_USERS)[keyof typeof TEST_USERS];

interface SignInOptions {
  user: TestUser;
  storageStatePath?: string;
  followUpUrl?: string;
}

const AUTH_HELPER_URL = "/api/test/auth";

async function waitForSessionReady(page: Page, followUpUrl?: string) {
  await page.goto(followUpUrl ?? "/");
  await page.waitForURL(/\/(?:$|project|applications|apply)/, {
    timeout: 20000,
  });
}

export const test = base.extend<{
  signIn: (options: SignInOptions) => Promise<void>;
  signOut: () => Promise<void>;
}>({
  signIn: async ({ page }, use) => {
    const signIn = async ({
      user,
      storageStatePath,
      followUpUrl,
    }: SignInOptions) => {
      await page.request.post(AUTH_HELPER_URL, {
        data: {
          email: user.email,
          password: user.password,
        },
      });

      await waitForSessionReady(page, followUpUrl);

      if (storageStatePath) {
        await page.context().storageState({ path: storageStatePath });
      }
    };

    await use(signIn);
  },
  signOut: async ({ page }, use) => {
    const signOut = async () => {
      await page.request.post(AUTH_HELPER_URL, { data: { action: "signOut" } });
      await page.goto("/");
    };
    await use(signOut);
  },
});

export { expect };

export async function signInUser(
  page: Page,
  options: SignInOptions,
): Promise<void> {
  await page.request.post(AUTH_HELPER_URL, {
    data: {
      email: options.user.email,
      password: options.user.password,
    },
  });

  await waitForSessionReady(page, options.followUpUrl);

  if (options.storageStatePath) {
    await page.context().storageState({ path: options.storageStatePath });
  }
}
