import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5000";

test.describe("Subscription Flow", () => {

  let creatorUsername;
  let subscriberEmail;
  const password = "Password@123";

  test.beforeEach(async ({ request, page }) => {

    const timestamp = Date.now().toString().slice(-6);

    creatorUsername = `creator${timestamp}`;
    subscriberEmail = `subscriber${timestamp}@mail.com`;

    await request.post(`${BASE_URL}/auth/signup`, {
      data: {
        name: "Creator",
        username: creatorUsername,
        email: `creator${timestamp}@mail.com`,
        password,
        role: "creator",
      },
    });

    const creatorLogin = await request.post(`${BASE_URL}/auth/login`, {
    data: {
        email: `creator${timestamp}@mail.com`,
        password,
    },
    });

    expect(creatorLogin.ok()).toBeTruthy();

    const creatorToken = (await creatorLogin.json()).data.accessToken;

    const tierResponse = await request.post(`${BASE_URL}/tiers/create`, {
    headers: {
        Authorization: `Bearer ${creatorToken}`,
    },
    data: {
        name: "Gold Tier",
        description: "Premium membership",
        price: 20,
        unlockDuration: 30,
    },
    });

    expect(tierResponse.ok()).toBeTruthy();

    await request.post(`${BASE_URL}/auth/signup`, {
      data: {
        name: "Subscriber",
        username: `subscriber${timestamp}`,
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

  });

  test("Subscriber can open creator profile", async ({ page }) => {

    await page.goto(`/subscriber/profile/${creatorUsername}`);

    await expect(page).toHaveURL(
      /subscriber\/profile/
    );

  });
  test("Subscribe button is visible", async ({ page }) => {

    await page.goto(`/subscriber/profile/${creatorUsername}`);

    const button = page.getByRole("button", {
        name: /subscribe/i,
    });

    await expect(button).toBeVisible();

    });
    
        test("Clicking Subscribe starts checkout", async ({ page }) => {

    await page.goto(`/subscriber/profile/${creatorUsername}`);

    await page.getByRole("button", {
        name: /subscribe/i,
    }).click();

    await expect(page).not.toHaveURL(
        /subscriber\/profile/
    );

    });

});