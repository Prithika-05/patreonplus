import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5000";

test.describe("Explore Creators", () => {

    let creatorEmail;
    let subscriberEmail;

    let creatorUsername;

    const password = "Password@123";
    

    test.beforeEach(async ({ request, page }) => {

    const timestamp = Date.now().toString().slice(-6);

    creatorEmail = `creator${timestamp}@mail.com`;
    creatorUsername = `creator${timestamp}`;

    subscriberEmail = `subscriber${timestamp}@mail.com`;

    const creatorRes = await request.post(`${BASE_URL}/auth/signup`, {
        data: {
        name: "Playwright Creator",
        username: creatorUsername,
        email: creatorEmail,
        password,
        role: "creator",
        },
    });


    const subscriberRes = await request.post(`${BASE_URL}/auth/signup`, {
        data: {
        name: "Playwright Subscriber",
        username: `sub${timestamp}`,
        email: subscriberEmail,
        password,
        role: "subscriber",
        },
    });

    await page.goto("/login");

    await page.locator("#email").fill(subscriberEmail);
    await page.locator("#password").fill(password);

    await page.getByRole("button", {
        name: /sign in/i,
    }).click();

    await page.waitForURL("**/subscriber/feed");

    await page.waitForTimeout(5000);

    });

  test("Subscriber can open Explore page", async ({ page }) => {

    await page.goto("/subscriber/explore");

    await expect(
      page.getByText(/discover amazing creators/i)
    ).toBeVisible();

    await expect(
      page.getByPlaceholder(
        /search by name, username, or niche/i
      )
    ).toBeVisible();

  });

  test("Subscriber can search for a creator", async ({ page }) => {

    await page.goto("/subscriber/explore");

    await page
        .getByPlaceholder(/search by name/i)
        .fill(creatorUsername);

    // Wait for debounce (500 ms in your component)
    await page.waitForTimeout(600);

    await expect(
        page.getByText("Playwright Creator")
    ).toBeVisible();

    });

    test("Subscriber can open a creator profile", async ({ page }) => {

    await page.goto("/subscriber/explore");

    await page.waitForTimeout(600);

    await page.getByRole("button", {
        name: /view profile/i,
    }).first().click();

    await expect(page).toHaveURL(
        /subscriber\/profile/
    );

    });

});