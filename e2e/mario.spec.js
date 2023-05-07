// @ts-check
import { test, expect } from '@playwright/test';

test('home has title', async ({ page }) => {
  await page.goto('http://localhost:12345/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Title/);
});

test('navigate to title page', async ({ page }) => {
    await page.goto('http://localhost:12345/');
  
    // Click the get started link.
    await page.getByRole('link', { name: 'Estudio de buscadores de empleo' }).click();
  
    // Expects the URL to contain intro.
    await expect(page).toHaveTitle(/Title/);
  });