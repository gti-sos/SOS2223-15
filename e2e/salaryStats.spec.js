40
// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('http://localhost:12345/');
  
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/SOS2223-15/);
  });

//Gráfica conjunta
test('get analytics', async ({ page }) => {
    await page.goto('http://localhost:12345/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Gráfica Conjunta' }).click();

    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*analytics/);
});

//Datos api
test('get salary-stats', async ({ page }) => {
    await page.goto('http://localhost:12345/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Estadísticas de asalariados' }).click();

    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*salary-stats/);
});

// Gráficas 
test('get graph salary-stats', async ({ page }) => {
    await page.goto('http://localhost:12345/graficas/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Gráficas Ángel' }).click();

    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*salary-stats/);
});

// Usos
test('get uses', async ({ page }) => {
    await page.goto('http://localhost:12345/integrations/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Uso 1 Estadisticas-Asalariados' }).click();

    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*uses-salary-stats/);
});

// Integraciones
test('get integrations', async ({ page }) => {
    await page.goto('http://localhost:12345/integrations/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Integraciones Estadisticas-Asalariados' }).click();

    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*int-salary-stats/);
});