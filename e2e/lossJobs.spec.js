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
test('get loss-jobs', async ({ page }) => {
    await page.goto('http://localhost:12345/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Causas de pérdidas de trabajo' }).click();

    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*loss-jobs/);
});

// Gráficas 
test('get graph loss-jobs', async ({ page }) => {
    await page.goto('http://localhost:12345/graficas/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Gráficas Mario' }).click();

    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*loss-jobs-graph/);
});

// Usos
test('get uses', async ({ page }) => {
    await page.goto('http://localhost:12345/integrations/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Uso 1 Perdidas' }).click();

    
    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*usos-loss-jobs/);
});

// Integraciones
test('get integrations', async ({ page }) => {
    await page.goto('http://localhost:12345/integrations/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Integracion 1 Perdidas' }).click();

    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*int-loss-jobs/);
});