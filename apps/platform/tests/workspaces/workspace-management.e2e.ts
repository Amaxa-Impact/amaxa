import type { Page } from "@playwright/test";

import { ADMIN_AUTH_STATE, expect, test } from "../fixtures";

test.describe("workspace management", () => {
  test.use({ storageState: ADMIN_AUTH_STATE });

  test.beforeEach(async ({ page }) => {
    await page.goto("/workspaces");
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("displays workspaces list page", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Workspaces" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Create Workspace/i }),
    ).toBeVisible();
  });

  test("opens create workspace dialog", async ({ page }) => {
    await page.getByRole("button", { name: /Create Workspace/i }).click();
    await expect(
      page.getByRole("heading", { name: "Create Workspace" }),
    ).toBeVisible();
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("URL Slug")).toBeVisible();
  });

  test("generates slug from name", async ({ page }) => {
    await page.getByRole("button", { name: /Create Workspace/i }).click();
    await page.getByLabel("Name").fill("Test Workspace Name");
    await page.getByRole("button", { name: "Generate from name" }).click();
    await expect(page.getByLabel("URL Slug")).toHaveValue(
      "test-workspace-name",
    );
  });

  test("creates a new workspace", async ({ page }) => {
    const uniqueSlug = `test-workspace-${Date.now()}`;

    await page.getByRole("button", { name: /Create Workspace/i }).click();
    await page.getByLabel("Name").fill("E2E Test Workspace");
    await page.getByLabel("URL Slug").fill(uniqueSlug);
    await page.getByRole("button", { name: "Create Workspace" }).click();

    await expect(page.getByText(uniqueSlug)).toBeVisible({
      timeout: 10000,
    });
  });

  test("validates slug format", async ({ page }) => {
    await page.getByRole("button", { name: /Create Workspace/i }).click();
    await page.getByLabel("Name").fill("Test");
    await page.getByLabel("URL Slug").fill("ab");

    await expect(
      page.getByRole("button", { name: "Create Workspace" }),
    ).toBeDisabled();
  });
});

test.describe("workspace settings", () => {
  test.use({ storageState: ADMIN_AUTH_STATE });

  const testWorkspaceSlug = process.env.E2E_WORKSPACE_SLUG;

  test.beforeEach(async ({ page }) => {
    test.skip(!testWorkspaceSlug, "E2E_WORKSPACE_SLUG is not set");
    await page.goto(`/${testWorkspaceSlug}/admin/settings`);
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("displays workspace settings page", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
    await expect(page.getByLabel("Workspace Name")).toBeVisible();
  });

  test("updates workspace name", async ({ page }) => {
    const nameInput = page.getByLabel("Workspace Name");
    const saveButton = page.getByRole("button", { name: /Save Changes/i });

    const originalName = await nameInput.inputValue();
    const newName = `${originalName} Updated`;

    await nameInput.fill(newName);
    await saveButton.click();
    await expect(nameInput).toHaveValue(newName);

    await nameInput.fill(originalName);
    await saveButton.click();
    await expect(nameInput).toHaveValue(originalName);
  });

  test("shows slug as read-only", async ({ page }) => {
    await expect(
      page.locator(`input[value="${testWorkspaceSlug ?? ""}"]`).first(),
    ).toBeDisabled();
  });

  test("navigates to users tab", async ({ page }) => {
    await page.getByRole("link", { name: /Users/i }).click();
    await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
  });
});

test.describe("workspace users management", () => {
  test.use({ storageState: ADMIN_AUTH_STATE });

  const testWorkspaceSlug = process.env.E2E_WORKSPACE_SLUG;

  test.beforeEach(async ({ page }) => {
    test.skip(!testWorkspaceSlug, "E2E_WORKSPACE_SLUG is not set");
    await page.goto(`/${testWorkspaceSlug}/admin/users`);
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("displays workspace users page", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Invite User/i }),
    ).toBeVisible();
  });

  test("opens invite user dialog", async ({ page }) => {
    await page.getByRole("button", { name: /Invite User/i }).click();
    await expect(
      page.getByRole("heading", { name: "Invite User" }),
    ).toBeVisible();
    await expect(page.getByLabel("Email Address")).toBeVisible();
    await expect(page.getByRole("dialog").getByRole("combobox")).toBeVisible();
  });

  test("validates email format in invite dialog", async ({ page }) => {
    await page.getByRole("button", { name: /Invite User/i }).click();
    await page.getByLabel("Email Address").fill("invalid-email");

    const sendButton = page.getByRole("button", { name: "Send Invitation" });
    await expect(sendButton).toBeDisabled();
  });

  test("sends invitation with valid email", async ({ page }) => {
    const testEmail = `test-${Date.now()}@example.com`;

    await page.getByRole("button", { name: /Invite User/i }).click();
    await page.getByLabel("Email Address").fill(testEmail);
    await page.getByRole("button", { name: "Send Invitation" }).click();

    await expect(page.getByText(testEmail)).toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe("invitation flow", () => {
  test.setTimeout(20_000);
  test.use({ storageState: ADMIN_AUTH_STATE });

  const testWorkspaceSlug = process.env.E2E_WORKSPACE_SLUG;

  const inviteUser = async (email: string, page: Page) => {
    await page.getByRole("button", { name: /Invite User/i }).click();
    await page.getByLabel("Email Address").fill(email);
    await page.getByRole("button", { name: "Send Invitation" }).click();
    await expect(
      page.getByRole("heading", { name: "Invite User" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("row").filter({ hasText: email }).first(),
    ).toBeVisible({ timeout: 10000 });
  };

  test("displays pending invitations table", async ({ page }) => {
    test.skip(!testWorkspaceSlug, "E2E_WORKSPACE_SLUG is not set");
    await page.goto(`/${testWorkspaceSlug}/admin/users`);

    const email = `pending-${Date.now()}@test.com`;
    await inviteUser(email, page);
  });

  test("can resend invitation", async ({ page }) => {
    test.skip(!testWorkspaceSlug, "E2E_WORKSPACE_SLUG is not set");
    await page.goto(`/${testWorkspaceSlug}/admin/users`);

    const email = `resend-${Date.now()}@test.com`;
    await inviteUser(email, page);

    const invitationRow = page.getByRole("row").filter({ hasText: email });
    await invitationRow.getByRole("button").click();
    await page.getByRole("menuitem", { name: /Resend/i }).click();

    await expect(invitationRow).toBeVisible();
  });

  test("can revoke invitation", async ({ page }) => {
    test.skip(!testWorkspaceSlug, "E2E_WORKSPACE_SLUG is not set");
    await page.goto(`/${testWorkspaceSlug}/admin/users`);

    const email = `revoke-${Date.now()}@test.com`;
    await inviteUser(email, page);

    const invitationRow = page.getByRole("row").filter({ hasText: email });
    await invitationRow.getByRole("button").click();
    await page.getByRole("menuitem", { name: /Revoke/i }).click();

    await expect(page.getByText(email)).toHaveCount(0, {
      timeout: 10000,
    });
  });
});
