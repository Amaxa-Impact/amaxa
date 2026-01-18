import { MEMBER_AUTH_STATE, test, TEST_USERS } from "../fixtures";

test("authenticate as project member", async ({ signIn }) => {
  await signIn({
    user: TEST_USERS.MEMBER,
    storageStatePath: MEMBER_AUTH_STATE,
    followUpUrl: "/",
  });
});
