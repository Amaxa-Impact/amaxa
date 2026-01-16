import { COACH_AUTH_STATE, test, TEST_USERS } from "../fixtures";

test("authenticate as project coach", async ({ page, signIn }) => {
  await signIn({
    user: TEST_USERS.COACH,
    storageStatePath: COACH_AUTH_STATE,
    followUpUrl: "/",
  });
});
