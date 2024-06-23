import { Session } from "next-auth";

type E2EUsers = {
  session: Session;
  password: string;
};

export const TEST_USER: E2EUsers = {
  session: {
    user: {
      id: "test_user",
      name: process.env.TEST_USER_USERNAME,
      permissions: new Set(["basics"]),
      project_permissions: "",
    },
    // expires in +1 day
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  },
  password: process.env.TEST_USER_PASSWORD!,
};

export const TEST_ADMIN: E2EUsers = {
  session: {
    user: {
      id: "test_user",
      name: "test user",
      permissions: new Set(["activities"]),
    },
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  },
  password: process.env.TEST_ADMIN_PASSWORD!,
};
