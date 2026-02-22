import type { Page } from "@playwright/test";

import { ADMIN_AUTH_STATE, expect, test } from "../fixtures";

const formId = process.env.E2E_FORM_ID ?? "";

test.describe("application scheduling admin", () => {
  test.setTimeout(20_000);
  test.use({ storageState: ADMIN_AUTH_STATE });

  test.beforeEach(async ({ page }) => {
    test.skip(!formId, "E2E_FORM_ID is not set");
    await page.goto(`/applications/${formId}/scheduling`);
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  const openTimeSlotModal = async (page: Page) => {
    await page.getByRole("button", { name: "Add Slot" }).click();
    await expect(
      page.getByRole("heading", { name: "Add Time Slot" }),
    ).toBeVisible();
  };

  const selectDate = async (page: Page) => {
    const dateTrigger = page.getByText("Pick a date");
    await dateTrigger.click();
    await page.getByRole("gridcell").first().click();
    await page.keyboard.press("Escape");
  };

  const setTimeDetails = async (page: Page) => {
    const dialog = page.getByRole("dialog");
    await dialog.locator('input[type="time"]').fill("10:30");
    await dialog.getByRole("combobox").first().click();
    await page.getByRole("option", { name: "Eastern Time (ET)" }).click();
  };

  test("opens slot form and fills required inputs", async ({ page }) => {
    await openTimeSlotModal(page);
    await selectDate(page);
    await setTimeDetails(page);
    await expect(
      page.getByRole("heading", { name: "Add Time Slot" }),
    ).toBeVisible();
  });
});
