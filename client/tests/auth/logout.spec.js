import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5000";

test.describe("Logout", () => {
  let email;
  const password = "Password@123";

  test.beforeEach(async ({ request }) => {
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
  });

  test("Creator can logout successfully", async ({ page }) => {
    await page.goto("/login");

    await page.locator("#email").fill(email);

    await page.locator("#password").fill(password);

    await page.getByRole("button", {
      name: /sign in/i,
    }).click();

    await page.waitForURL("**/creator/dashboard");

    await expect(page).toHaveURL(/creator\/dashboard/);

    await page.getByRole("button", {
      name: /sign out/i,
    }).click();

    await page.waitForURL("**/login");

    await expect(page).toHaveURL(/login/);

    const accessToken = await page.evaluate(() =>
      localStorage.getItem("accessToken")
    );

    const refreshToken = await page.evaluate(() =>
      localStorage.getItem("refreshToken")
    );

    const user = await page.evaluate(() =>
      localStorage.getItem("user")
    );

    expect(accessToken).toBeNull();
    expect(refreshToken).toBeNull();
    expect(user).toBeNull();
  });
});