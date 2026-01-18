/**
 * Combined E2E Test Fixtures
 *
 * This module merges all fixtures together to provide a unified
 * test context with authentication, Convex, and page utilities.
 */

import { mergeTests } from "@playwright/test";

import type { TestUser } from "./auth.fixture";
import {
  ADMIN_AUTH_STATE,
  test as authTest,
  COACH_AUTH_STATE,
  expect,
  MEMBER_AUTH_STATE,
  signInUser,
  TEST_USERS,
  USER_AUTH_STATE,
} from "./auth.fixture";

export const test = mergeTests(authTest);
export {
  expect,
  TEST_USERS,
  USER_AUTH_STATE,
  ADMIN_AUTH_STATE,
  COACH_AUTH_STATE,
  MEMBER_AUTH_STATE,
  signInUser,
  type TestUser,
};
