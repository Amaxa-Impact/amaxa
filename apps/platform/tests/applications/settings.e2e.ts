import { ADMIN_AUTH_STATE, expect, test } from "../fixtures";

const formId = process.env.E2E_FORM_ID ?? "";
const formSlug = process.env.E2E_FORM_SLUG ?? "";

test.describe("application form settings", () => {
  test.use({ storageState: ADMIN_AUTH_STATE });

  test.beforeEach(async ({ page }) => {
    test.skip(!formId || !formSlug, "E2E_FORM_ID or E2E_FORM_SLUG is not set");
    await page.goto(`/applications/${formId}/settings`);
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("updates slug and publish status", async ({ page }) => {
    const slugInput = page.getByLabel("URL Slug");
    const publishSwitch = page.getByLabel("Published");
    const submitButton = page.getByRole("button", { name: "Submit" });

    const updatedSlug = `${formSlug}-updated`;
    await slugInput.fill(updatedSlug);
    await publishSwitch.click();
    await submitButton.click();

    await expect(submitButton).toHaveText(/Submit|Saving/);

    await page.reload();

    await expect(slugInput).toHaveValue(updatedSlug);
    await expect(publishSwitch).toBeChecked();
  });

  test("validates slug length", async ({ page }) => {
    const slugInput = page.getByLabel("URL Slug");
    const submitButton = page.getByRole("button", { name: "Submit" });

    await slugInput.fill("a");
    await submitButton.click();

    await expect(submitButton).toHaveText("Submit");
  });
});
