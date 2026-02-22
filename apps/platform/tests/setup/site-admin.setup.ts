import { ADMIN_AUTH_STATE, test, TEST_USERS } from "../fixtures";

test.setTimeout(30_000);

test("authenticate as site admin", async ({ signIn }) => {
  await signIn({
    user: TEST_USERS.ADMIN,
    storageStatePath: ADMIN_AUTH_STATE,
    followUpUrl: "/applications",
    role: "admin",
  });
});
