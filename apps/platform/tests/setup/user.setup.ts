import { test, TEST_USERS, USER_AUTH_STATE } from "../fixtures";

test("authenticate as user", async ({ page, signIn }) => {
  await signIn({
    user: TEST_USERS.USER,
    storageStatePath: USER_AUTH_STATE,
    followUpUrl: "/",
  });
});
