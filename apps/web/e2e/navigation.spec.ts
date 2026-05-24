import { test, expect } from '@playwright/test';

test.describe('Bottom navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders 5 tabs with "+" button centered', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: /navegação principal/i });
    await expect(nav).toBeVisible();

    const addButton = page.getByRole('button', { name: /adicionar receita/i });
    await expect(addButton).toBeVisible();

    for (const label of ['Home', 'Receitas', 'Perfil', 'Config.']) {
      await expect(nav.getByText(label)).toBeVisible();
    }
  });

  test('navigates to Home when Home tab is tapped', async ({ page }) => {
    await page.getByRole('link', { name: /perfil/i }).click();
    await page.getByRole('link', { name: /^home$/i }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('home-screen')).toBeVisible();
  });

  test('navigates to Add screen when "+" is tapped', async ({ page }) => {
    await page.getByRole('button', { name: /adicionar receita/i }).click();
    await expect(page).toHaveURL('/add');
    await expect(page.getByTestId('add-screen')).toBeVisible();
  });

  test('navigates to Profile screen when Perfil tab is tapped', async ({ page }) => {
    await page.getByRole('link', { name: /perfil/i }).click();
    await expect(page).toHaveURL('/profile');
    await expect(page.getByTestId('profile-screen')).toBeVisible();
  });

  test('highlights active tab in amber', async ({ page }) => {
    const homeTab = page.getByRole('link', { name: /^home$/i });
    await expect(homeTab).toHaveCSS('color', 'rgb(232, 160, 32)');
  });

  test('does not show horizontal scrollbar', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
