// @ts-check
/*import { test, expect } from '@playwright/test';

test('¿Tiene el titulo?: "Esto es un Title"', async ({ page }) => {
  await page.goto('http://localhost:12345/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Esto es un Title/);
});

test('navigate to title page', async ({ page }) => {
    await page.goto('http://localhost:12345/');
  
    // Click the get started link.
    await page.getByRole('link', { name: 'Inicio' }).click();
  
    // Expects the URL to contain intro.
    await expect(page).toHaveTitle(/Title/);
  });