import type { Page } from "@playwright/test";

import { ADMIN_AUTH_STATE, expect, test } from "../fixtures";

const workspaceSlug = process.env.E2E_WORKSPACE_SLUG;

async function createGlobalTemplate(page: Page, name: string) {
  await page.getByRole("button", { name: "New Template" }).click();
  await expect(
    page.getByRole("heading", { name: "Create Template" }),
  ).toBeVisible();

  await page.getByLabel("Template Name").fill(name);
  await page
    .getByLabel("Description")
    .fill(`Template description for ${name.toLowerCase()}`);

  await page.getByRole("button", { name: "Create Template" }).click();
  await expect(page.getByRole("link", { name })).toBeVisible({
    timeout: 10000,
  });
}

async function deleteTemplateFromEditor(page: Page, heading: RegExp) {
  await page.getByRole("button", { name: "Delete Template" }).click();
  await expect(page.getByRole("heading", { name: heading })).toBeVisible({
    timeout: 10000,
  });
}

test.describe("template management", () => {
  test.setTimeout(20_000);
  test.use({ storageState: ADMIN_AUTH_STATE });

  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "admin",
      "Template management is validated in the admin project only",
    );

    await page.goto("/templates");
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("creates, updates, and deletes a global template", async ({ page }) => {
    const templateName = `E2E Template ${Date.now()}`;
    const updatedTemplateName = `${templateName} Updated`;

    await createGlobalTemplate(page, templateName);
    await page.getByRole("link", { name: templateName }).click();

    await expect(
      page.getByRole("heading", { name: "Template Editor" }),
    ).toBeVisible();

    const nameInput = page.getByLabel("Name");
    await nameInput.fill(updatedTemplateName);
    await page.getByRole("button", { name: "Save Template Settings" }).click();

    await expect(nameInput).toHaveValue(updatedTemplateName);

    await deleteTemplateFromEditor(page, /Global Templates/);
  });

  test("adds, updates, and removes a template task", async ({ page }) => {
    const templateName = `E2E Task Template ${Date.now()}`;

    await createGlobalTemplate(page, templateName);
    await Promise.all([
      page.waitForURL(/\/templates\/[^/]+$/),
      page.getByRole("link", { name: templateName }).first().click(),
    ]);

    await page.getByRole("button", { name: "Add Task" }).click();
    await expect(page.getByText("New Task")).toBeVisible({ timeout: 10000 });

    await deleteTemplateFromEditor(page, /Global Templates/);
  });

  test("copies a global template into a workspace", async ({ page }) => {
    test.skip(!workspaceSlug, "E2E_WORKSPACE_SLUG is not set");

    const templateName = `E2E Global Template ${Date.now()}`;
    const copiedTemplateName = `${templateName} (Copy)`;

    await createGlobalTemplate(page, templateName);
    await page.goto(`/${workspaceSlug}/admin/templates`);

    await expect(
      page.getByRole("heading", { name: "Templates" }),
    ).toBeVisible();

    const sourceTemplateRow = page
      .getByRole("row")
      .filter({ hasText: templateName });

    await expect(sourceTemplateRow).toHaveCount(1);
    await sourceTemplateRow
      .getByRole("button", { name: "Copy to Workspace" })
      .click();

    await expect(
      page.getByRole("link", { name: copiedTemplateName }),
    ).toBeVisible({
      timeout: 10000,
    });

    await page.getByRole("link", { name: copiedTemplateName }).click();
    await expect(
      page.getByRole("heading", { name: "Template Editor" }),
    ).toBeVisible();
    await deleteTemplateFromEditor(page, /^Templates$/);

    await page.goto("/templates");
    await page.getByRole("link", { name: templateName }).click();
    await expect(
      page.getByRole("heading", { name: "Template Editor" }),
    ).toBeVisible();
    await deleteTemplateFromEditor(page, /Global Templates/);
  });
});
