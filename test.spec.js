const { test, expect } = require('@playwright/test');
const path = require('path');

test('security vulnerability is fixed', async ({ page }) => {
  const filePath = path.resolve(__dirname, 'index.html');
  await page.goto(`file://${filePath}`);

  // Need to open admin overlay first to make it visible
  await page.evaluate(() => openAdmOv());

  // Trigger recovery form
  await page.evaluate(() => showRecovery());

  // Try to bypass with an empty answer
  await page.fill('#rec-ans', '');
  await page.evaluate(() => tryRecovery());

  const errText = await page.textContent('#rec-err');
  expect(errText).toBe('No security question set. Recovery unavailable.');
});
