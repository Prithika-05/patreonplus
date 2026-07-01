import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5000";

test.describe("Public Creator Profile", () => {

  let creatorEmail;
  let subscriberEmail;
  const password = "Password@123";

test.beforeEach(async ({ request, page }) => {
  const unique = Date.now().toString().slice(-6);

  const creatorUsername = `creator${unique}`;
  creatorEmail = `${creatorUsername}@mail.com`;

  const subscriberUsername = `sub${unique}`;
  subscriberEmail = `${subscriberUsername}@mail.com`;

  const creatorSignup = await request.post(`${BASE_URL}/auth/signup`, {
    data: {
      name: "Playwright Creator",
      username: creatorUsername,
      email: creatorEmail,
      password,
      role: "creator",
    },
  });

  expect(creatorSignup.ok()).toBeTruthy();

  const creatorLogin = await request.post(`${BASE_URL}/auth/login`, {
    data: {
      email: creatorEmail,
      password,
    },
  });

  expect(creatorLogin.ok()).toBeTruthy();

  const creatorLoginBody = await creatorLogin.json();
  const creatorToken = creatorLoginBody.data.accessToken;

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

  const subscriberSignup = await request.post(`${BASE_URL}/auth/signup`, {
    data: {
      name: "Playwright Subscriber",
      username: subscriberUsername,
      email: subscriberEmail,
      password,
      role: "subscriber",
    },
  });

  expect(subscriberSignup.ok()).toBeTruthy();

  await page.goto("/login");

  await page.locator("#email").fill(subscriberEmail);
  await page.locator("#password").fill(password);

  await page.getByRole("button", {
    name: /sign in/i,
  }).click();

  await page.waitForURL("**/subscriber/feed");

  await page.goto(`/subscriber/profile/${creatorUsername}`);
});


  test("Subscriber can view creator information", async ({ page }) => {

    await expect(
      page.getByText("Playwright Creator")
    ).toBeVisible();

    await expect(
      page.getByText(`@creator`)
    ).toBeVisible();

    await expect(
      page.getByText(/choose a membership tier/i)
    ).toBeVisible();

  });

  test("Subscriber can view creator tiers", async ({ page }) => {

    await expect(
        page.getByText(/choose a membership tier/i)
    ).toBeVisible();

    await expect(
        page.getByRole("button", {
        name: /subscribe to/i,
        }).first()
    ).toBeVisible();

    });

    test("Subscriber can start subscription", async ({ page }) => {

    const subscribeButton = page.getByRole("button", {
        name: /subscribe to/i,
    }).first();

    await expect(subscribeButton).toBeVisible();

    await subscribeButton.click();

    // Depending on your implementation:
    // Either Stripe Checkout opens,
    // or navigation occurs.
    });

});