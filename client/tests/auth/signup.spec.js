import { test, expect } from "@playwright/test";

test.describe("Signup", () => {

  test("Creator can signup successfully", async ({ page }) => {

    const timestamp = Date.now();

    await page.goto("/signup");

    await page.locator("#name").fill("Playwright Creator");

    await page.locator("#username").fill(`creator${timestamp}`);

    await page.locator("#email").fill(
      `creator${timestamp}@mail.com`
    );

    await page.locator("#password").fill(
      "Password@123"
    );

    await page.locator("button[role='combobox']").click();

    await page.getByRole("option", {
      name: "Creator",
    }).click();

    await page.getByRole("button", {
      name: /sign up/i,
    }).click();

    await page.waitForURL("**/login");

    await expect(page).toHaveURL(/login/);

  });

});