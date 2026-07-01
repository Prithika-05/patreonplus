import { test, expect } from "@playwright/test";
import { error } from "node:console";


test.describe("Protected Routes", () => {

  test("Unauthenticated user cannot access creator dashboard", async ({ page }) => {

    await page.goto("/creator/dashboard");

    await expect(page).toHaveURL(/login/);

  });

  test("Unauthenticated user cannot access subscriber feed", async ({ page }) => {

    await page.goto("/subscriber/feed");

    await expect(page).toHaveURL(/login/);

    });

    const BASE_URL = "http://localhost:5000";

    test("Subscriber cannot access creator dashboard", async ({
    request,
    page,
    }) => {

    const unique = Date.now().toString().slice(-6);

    const username = `sub${unique}`;
    const email = `${username}@mail.com`;
    const password = "Password@123";

    const signupResponse = await request.post(`${BASE_URL}/auth/signup`, {
    data: {
        name: "Subscriber",
        username,
        email,
        password,
        role: "subscriber",
    },
    });

    expect(signupResponse.ok()).toBeTruthy();

    await page.goto("/login");

    await page.locator("#email").fill(email);
    await page.locator("#password").fill(password);

    await page.getByRole("button", {
        name: /sign in/i,
    }).click();

    await page.waitForURL("**/subscriber/feed");

    await page.goto("/creator/dashboard");

    await expect(page).toHaveURL(/unauthorized/);

    });

    test("Creator cannot access subscriber feed", async ({
    request,
    page,
    }) => {

    const timestamp = Date.now().toString().slice(-6);

    const email = `creator${timestamp}@mail.com`;

    const password = "Password@123";

    await request.post(`${BASE_URL}/auth/signup`, {
        data: {
        name: "Creator",
        username: `creator${timestamp}`,
        email,
        password,
        role: "creator",
        },
    });

    await page.goto("/login");

    await page.locator("#email").fill(email);
    await page.locator("#password").fill(password);

    await page.getByRole("button", {
        name: /sign in/i,
    }).click();

    await page.waitForURL("**/creator/dashboard");

    await page.goto("/subscriber/feed");

    await expect(page).toHaveURL(/unauthorized/);

    });
});