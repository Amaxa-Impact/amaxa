import { expect, test } from "./fixtures";

test.describe("apply form", () => {
  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("supports all custom fields", async ({ page }) => {
    test.skip(!process.env.E2E_FORM_SLUG, "E2E_FORM_SLUG is not set");

    // Mock the convex-fs upload endpoint
    await page.route("**/*.convex.site/fs/upload", async (route) => {
      await route.fulfill({
        json: { blobId: "test-blob-id-" + Date.now() },
      });
    });

    await page.route("**/api/field-type", async (route) => {
      await route.fulfill({
        json: {
          fieldType: "text",
          reasoning: "stubbed",
          suggestedOptions: [],
        },
      });
    });

    await page.goto(`/apply/${process.env.E2E_FORM_SLUG ?? "e2e-apply-form"}`);

    await page.getByLabel("Full Name").fill("Jane Doe");
    await page.getByLabel("Email Address").fill("jane@example.com");

    await page.getByLabel("Short Answer").fill("Hello world");
    await page.getByLabel("Long Answer").fill("This is a longer response.");
    await page.getByLabel("Number Input").fill("3");

    await expect(page.getByLabel("Experience Details")).toHaveCount(0);

    const experienceSelect = page.getByRole("combobox").first();
    await experienceSelect.click();
    await page.getByRole("option", { name: "Yes" }).click();

    await expect(page.getByLabel("Experience Details")).toBeVisible();
    await page.getByLabel("Experience Details").fill("5 years");

    await page.getByLabel("TypeScript").check();
    await page.getByLabel("React").check();

    await page.getByLabel(/Click to upload/i).setInputFiles({
      name: "resume.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("resume"),
    });

    await expect(page.getByText("resume.pdf")).toBeVisible();

    await page.getByRole("button", { name: "Submit Application" }).click();

    await expect(
      page.getByRole("heading", { name: "Application Submitted!" }),
    ).toBeVisible();
  });
});
