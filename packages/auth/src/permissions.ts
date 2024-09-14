import type { Session } from "next-auth";

import { env } from "../env";

interface E2EUsers {
  session: Session;
  password: string;
}

export const TEST_USER: E2EUsers = {
  session: {
    user: {
      id: "test_user",
      name: "Jane Doe",
      role: "User",
      status: "Unverified",
    },
    // expires in +1 day
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  },
  password: env.TEST_USER_PASSWORD,
};

export const TEST_ADMIN: E2EUsers = {
  session: {
    user: {
      id: "test_user",
      name: "test user",
      role: "Admin",
      status: "Verified",
    },
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  },
  password: env.TEST_ADMIN_PASSWORD,
};

export const test = "something";
