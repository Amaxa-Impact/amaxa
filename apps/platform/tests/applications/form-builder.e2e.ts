import type { Page } from "@playwright/test";

import { ADMIN_AUTH_STATE, expect, test } from "../fixtures";

const timestamp = Date.now();
const formTitle = `E2E Form ${timestamp}`;
const formDescription = "Form description for E2E";
const slugBase = `e2e-form-${timestamp}`;

test.describe("application form builder CRUD", () => {
  test.setTimeout(30_000);
  test.use({ storageState: ADMIN_AUTH_STATE });

  test.beforeEach(async ({ page }) => {
    await page.route("**/api/field-type", async (route) => {
      await route.fulfill({
        json: {
          fieldType: "text",
          reasoning: "stubbed",
          suggestedOptions: [],
        },
      });
    });
    await page.goto("/applications");
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  const createForm = async (page: Page) => {
    await page.getByText("Create Form").first().click();
    await expect(
      page.getByRole("heading", { name: "Create Application Form" }),
    ).toBeVisible();

    await page.getByLabel("Title").fill(formTitle);
    await page.getByLabel("Description (optional)").fill(formDescription);
    await page.getByLabel("URL Slug").fill(slugBase);
    await page.getByRole("button", { name: "Create Form" }).click();

    await expect(page.getByText(formTitle)).toBeVisible();
  };

  const openFormEditor = async (page: Page) => {
    await Promise.all([
      page.waitForURL(/\/applications\/[^/]+\/edit$/),
      page.getByText(formTitle).click(),
    ]);
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByPlaceholder("Form title")).toBeVisible();
  };

  test("creates and edits form fields and sections", async ({ page }) => {
    await createForm(page);
    await openFormEditor(page);

    const titleInput = page.getByPlaceholder("Form title");
    const descriptionInput = page.getByPlaceholder(
      "Form description (optional)",
    );

    await titleInput.fill(`${formTitle} Updated`);
    await descriptionInput.fill("Updated description");

    await page.getByRole("button", { name: "Add Section" }).click();
    await expect(page.getByPlaceholder("Section Title")).toBeVisible();

    const sectionTitle = page.getByPlaceholder("Section Title").first();
    await sectionTitle.fill("Section One");
    await page
      .getByPlaceholder("Section description (optional)")
      .fill("Section description");

    const firstAddQuestion = page
      .getByRole("button", { name: "Add Question" })
      .first();
    await firstAddQuestion.click();
    const questionInput = page.getByPlaceholder("Question").first();
    await questionInput.fill("What is your experience?");

    const descriptionField = page.getByPlaceholder("Description (optional)");
    await descriptionField.first().fill("Tell us more");

    await page.getByText("Required").first().click();

    await page.locator('[data-slot="select-trigger"]').first().click();
    await page.getByRole("option", { name: "Dropdown" }).click();
    await expect(page.getByPlaceholder("Option 1")).toBeVisible();
    await page.getByPlaceholder("Option 1").fill("Yes");
    await expect(page.locator('input[value="Yes"]').first()).toBeVisible();
  });
});
