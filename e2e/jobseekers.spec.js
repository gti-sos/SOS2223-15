
// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('http://localhost:12345/');
  
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/SOS2223-15/);
  });

// Vídeos
test('get about', async ({ page }) => {
    await page.goto('http://localhost:5173/about');

    // Click the get started link.
    await page.getByRole('link', { name: 'Vídeo Demandantes-Empleo' }).click();

    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*about/);
});

//Gráfica conjunta
test('get analytics', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Gráfica Conjunta' }).click();

    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*analytics/);
});

//Datos api
test('get jobseekers-studies', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Estudio de demandantes de empleo' }).click();

    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*jobseekers-studies/);
});

// Gráficas 
test('get graph jobseekers-studies', async ({ page }) => {
    await page.goto('http://localhost:5173/graficas/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Gráficas Demandantes-Empleo' }).click();

    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*jobseekers/);
});

// Usos
test('get uses', async ({ page }) => {
    await page.goto('http://localhost:5173/integrations/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Usos Demandantes-Empleo' }).click();

    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*usos-jobseekers-studies/);
});

// Integraciones
test('get integrations', async ({ page }) => {
    await page.goto('http://localhost:5173/integrations/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Integraciones Demandantes-Empleo' }).click();

    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*int-jobseekers-studies/);
});