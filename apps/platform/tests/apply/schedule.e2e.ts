import { expect, test, USER_AUTH_STATE } from "../fixtures";

const scheduleToken = process.env.E2E_SCHEDULE_TOKEN ?? "";

test.describe("applicant scheduling", () => {
  test.use({ storageState: USER_AUTH_STATE });

  test.beforeEach(async ({ page }) => {
    test.skip(!scheduleToken, "E2E_SCHEDULE_TOKEN is not set");
    await page.goto(`/schedule/${scheduleToken}`);
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("books an available slot", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Schedule Your Interview" }),
    ).toBeVisible();

    const slotCard = page
      .getByRole("button")
      .filter({ hasText: /AM|PM/ })
      .first();
    await slotCard.click();

    const confirmButton = page.getByRole("button", {
      name: "Confirm Selection",
    });
    await confirmButton.click();

    await expect(
      page.getByRole("heading", { name: "Interview Scheduled!" }),
    ).toBeVisible();
  });
});
