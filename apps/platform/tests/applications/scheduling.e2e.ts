import type { Page } from "@playwright/test";

import { ADMIN_AUTH_STATE, expect, test } from "../fixtures";

const formId = process.env.E2E_FORM_ID ?? "";

test.describe("application scheduling admin", () => {
  test.use({ storageState: ADMIN_AUTH_STATE });

  test.beforeEach(async ({ page }) => {
    test.skip(!formId, "E2E_FORM_ID is not set");
    await page.goto(`/applications/${formId}/scheduling`);
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  /**
   * Opens the time slot modal.
   */
  const openTimeSlotModal = async (page: Page) => {
    await page.getByRole("button", { name: "Add Slot" }).click();
    await expect(
      page.getByRole("heading", { name: "Add Time Slot" }),
    ).toBeVisible();
  };

  /**
   * Selects the first available date.
   */
  const selectDate = async (page: Page) => {
    const dateTrigger = page.getByText("Pick a date");
    await dateTrigger.click();
    await page.getByRole("gridcell").first().click();
  };

  /**
   * Sets time and timezone for the slot.
   */
  const setTimeDetails = async (page: Page) => {
    await page.getByLabel("Time").fill("10:00");
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("combobox").first().click();
    await page.getByRole("option", { name: "Eastern Time (ET)" }).click();
  };

  test("creates, edits, assigns admin, and deletes a slot", async ({
    page,
  }) => {
    await openTimeSlotModal(page);
    await selectDate(page);
    await setTimeDetails(page);

    await page.getByRole("button", { name: "Create Slot" }).click();
    await expect(page.getByText("Time slot created")).toBeVisible();

    const editButton = page.getByTitle("Edit slot").first();
    await editButton.click();
    await expect(
      page.getByRole("heading", { name: "Edit Time Slot" }),
    ).toBeVisible();

    const dialog = page.getByRole("dialog");
    const adminTrigger = dialog.getByRole("combobox").last();
    await adminTrigger.click();
    const adminOption = page.getByRole("option").first();
    const adminName = await adminOption.textContent();
    await adminOption.click();

    await page.getByRole("button", { name: "Update Slot" }).click();
    await expect(page.getByText("Time slot updated")).toBeVisible();

    if (adminName) {
      await expect(page.getByText(adminName)).toBeVisible();
    }

    await page.getByTitle("Delete slot").first().click();
    await page.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText("Time slot deleted")).toBeVisible();
  });
});
