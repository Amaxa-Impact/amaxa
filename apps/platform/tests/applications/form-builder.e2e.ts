import type { Page } from "@playwright/test";

import { ADMIN_AUTH_STATE, expect, test } from "../fixtures";

const timestamp = Date.now();
const formTitle = `E2E Form ${timestamp}`;
const formDescription = "Form description for E2E";
const slugBase = `e2e-form-${timestamp}`;

test.describe("application form builder CRUD", () => {
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

  /**
   * Opens the create form dialog and submits the form.
   */
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

  /**
   * Opens the form editor for the created form.
   */
  const openFormEditor = async (page: Page) => {
    await page.getByText(formTitle).click();
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

    await page.getByLabel("Required").first().click();

    await page.getByRole("button", { name: "Short Answer" }).click();
    await page.getByRole("option", { name: "Dropdown" }).click();

    await page.getByRole("button", { name: "Add option" }).click();
    await page.getByPlaceholder("Option 2").fill("Yes");
    await page.getByRole("button", { name: "Add option" }).click();
    await page.getByPlaceholder("Option 3").fill("No");

    const addQuestionButtons = page.getByRole("button", {
      name: "Add Question",
    });
    await addQuestionButtons.nth(1).click();
    const secondQuestion = page.getByPlaceholder("Question").last();
    await secondQuestion.fill("Upload your resume");

    await page.getByRole("button", { name: "Short Answer" }).last().click();
    await page.getByRole("option", { name: "File Upload" }).click();

    await expect(page.getByText("File Upload Settings")).toBeVisible();
    await page.getByRole("button", { name: "Documents only" }).click();

    const fileSizeField = page.getByText("Maximum File Size").locator("..");
    await fileSizeField.getByRole("button").click();
    await page.getByRole("option", { name: "10 MB" }).click();

    const duplicateButton = page.getByTitle("Duplicate").first();
    await duplicateButton.click();

    const deleteButton = page.getByTitle("Delete").first();
    await deleteButton.click();

    await page.getByLabel("Move section up").click();
    await page.getByLabel("Move section down").click();
  });
});
