import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5000";

test.describe("Login", () => {
  let email;
  const password = "Password@123";

  test.beforeEach(async ({ request }) => {
    email = `creator${Date.now()}@mail.com`;

    const signupResponse = await request.post(
      `${BASE_URL}/auth/signup`,
      {
        data: {
          name: "Playwright Creator",
          username: `creator${Date.now()}`,
          email,
          password,
          role: "creator",
        },
      }
    );

    expect(signupResponse.ok()).toBeTruthy();
  });

  test("Creator can login successfully", async ({ page }) => {
    await page.goto("/login");

    await page.locator("#email").fill(email);

    await page.locator("#password").fill(password);

    await page.getByRole("button", {
      name: /sign in/i,
    }).click();

    await page.waitForURL("**/creator/dashboard");

    await expect(page).toHaveURL(/creator\/dashboard/);

    const accessToken = await page.evaluate(() =>
      localStorage.getItem("accessToken")
    );

    const refreshToken = await page.evaluate(() =>
      localStorage.getItem("refreshToken")
    );

    const user = await page.evaluate(() =>
      localStorage.getItem("user")
    );

    expect(accessToken).not.toBeNull();
    expect(refreshToken).not.toBeNull();
    expect(user).not.toBeNull();
  });
});