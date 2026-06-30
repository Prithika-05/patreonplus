import { test, expect } from "@playwright/test";
const BASE_URL = "http://localhost:5000";

test.describe("Tier Management", () => {
  let email;
  const password = "Password@123";

  test.beforeEach(async ({ request, page }) => {
    const timestamp = Date.now();

    email = `creator${timestamp}@mail.com`;

    const signupResponse = await request.post(
      `${BASE_URL}/auth/signup`,
      {
        data: {
          name: "Playwright Creator",
          username: `creator${timestamp}`,
          email,
          password,
          role: "creator",
        },
      }
    );

    expect(signupResponse.ok()).toBeTruthy();

    await page.goto("/login");

    await page.locator("#email").fill(email);
    await page.locator("#password").fill(password);

    await page.getByRole("button", {
      name: /sign in/i,
    }).click();

    await page.waitForURL("**/creator/dashboard");
  });

  test("Creator can create a new tier", async ({ page }) => {

    await page.goto("/creator/tiers");

    await page.getByRole("button", {
    name: "Create New Tier",
    }).click();

    await page.locator("#name").fill("Gold Tier");

    await page.locator("#description").fill(
      "Premium membership tier"
    );

    await page.locator("#price").fill("20");

    await page.locator("#duration").fill("30");

    await page.getByRole("button", {
      name: /^create tier$/i,
    }).click();

    await expect(
      page.getByText("Gold Tier")
    ).toBeVisible();

    await expect(
      page.getByText("Premium membership tier")
    ).toBeVisible();

    await expect(
      page.getByText("$20")
    ).toBeVisible();

  });

    test("Creator can edit an existing tier", async ({ page }) => {

    await page.goto("/creator/tiers");

    await page.getByRole("button", {
        name: "Create New Tier",
    }).click();

    await page.locator("#name").fill("Silver Tier");
    await page.locator("#description").fill("Basic membership");
    await page.locator("#price").fill("10");
    await page.locator("#duration").fill("30");

    await page.getByRole("button", {
        name: /^create tier$/i,
    }).click();

    await expect(page.getByText("Silver Tier")).toBeVisible();

    await page.getByRole("button", {
        name: /edit/i,
    }).first().click();

    await page.locator("#name").fill("Platinum Tier");

    await page.locator("#description").fill(
        "Updated premium membership"
    );

    await page.getByRole("button", {
        name: /update tier/i,
    }).click();

    await expect(
        page.getByText("Platinum Tier")
    ).toBeVisible();

    await expect(
        page.getByText("Updated premium membership")
    ).toBeVisible();

    });

    test("Creator can delete an existing tier", async ({ page }) => {

    await page.goto("/creator/tiers");

    // Create a tier first
    await page.getByRole("button", {
        name: "Create New Tier",
    }).click();

    await page.locator("#name").fill("Delete Tier");

    await page.locator("#description").fill(
        "Tier to be deleted"
    );

    await page.locator("#price").fill("15");

    await page.locator("#duration").fill("30");

    await page.getByRole("button", {
        name: /^create tier$/i,
    }).click();

    // Verify it exists
    await expect(
        page.getByText("Delete Tier")
    ).toBeVisible();

    // Click Delete button
    // Accept the browser confirmation dialog
    page.once("dialog", async (dialog) => {
        expect(dialog.type()).toBe("confirm");
        await dialog.accept();
    });

    // Click Delete
    await page.getByRole("button", {
        name: /delete/i,
    }).first().click();

    // Wait until the tier disappears
    await expect(
        page.getByText("Tier to be deleted")
    ).not.toBeVisible();

    // Confirm deletion (only if a confirmation dialog appears)
    const confirmButton = page.getByRole("button", {
        name: /confirm|yes|delete/i,
    });

    if (await confirmButton.isVisible().catch(() => false)) {
        await confirmButton.click();
    }

    // Wait for the confirmation dialog to close
    await expect(
        page.getByRole("heading", { name: "Delete Tier" })
    ).not.toBeVisible();

    // Verify the deleted tier is no longer displayed
    await expect(
        page.getByText("Tier to be deleted")
    ).not.toBeVisible();

    });

});