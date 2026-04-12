const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:5173';

let token;
let tierId;

test.beforeAll(async ({ request }) => {

  const email = `test${Date.now()}@mail.com`;

  await request.post(`${BASE_URL}/auth/signup`, {
    data: {
      name: 'Test User',
      username: 'testuser',
      email,
      password: '12345',
      role: 'creator',
    },
  });

  const loginRes = await request.post(`${BASE_URL}/auth/login`, {
    data: {
      email,
      password: '12345',
    },
  });

  const loginData = await loginRes.json();
  token = loginData.token;

  const tierRes = await request.post(`${BASE_URL}/tiers/create`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      name: 'Test Tier',
      price: 10,
      unlockDuration: 30,
    },
  });

  const tierData = await tierRes.json();
  tierId = tierData.tier.id;
});

test('FULL CONTENT FLOW (Frontend + Backend)', async ({ page }) => {

  await page.addInitScript((token) => {
    localStorage.setItem('token', token);
  }, token);

  await page.goto(`${FRONTEND_URL}/creator/contents`);

  await page.click('button:has-text("Add New Content")');

  await page.fill('#title', 'Automated Test Content');
  await page.fill('#description', 'Full integration test');
  await page.fill('#fileUrl', 'http://file.com/video.mp4');

  await page.click('[role="combobox"]');

  await page.click(`[role="option"] >> text=Test Tier`);

  await page.click('button:has-text("Publish Content")');

  await expect(page.locator('text=Automated Test Content')).toBeVisible();

  const deleteButton = page.locator('button').filter({
    has: page.locator('svg'),
  }).last();

  await deleteButton.click();

  await expect(page.locator('text=Automated Test Content')).not.toBeVisible();
});