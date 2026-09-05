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

  // As abas são <button> com router.push, não <a> — daí testid em vez de role link.
  test('navigates to Home when Home tab is tapped', async ({ page }) => {
    await page.getByTestId('nav-profile').click();
    await page.getByTestId('nav-home').click();
    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('home-screen')).toBeVisible();
  });

  test('navigates to Add screen when "+" is tapped', async ({ page }) => {
    await page.getByRole('button', { name: /adicionar receita/i }).click();
    await expect(page).toHaveURL('/adicionar');
    await expect(page.getByTestId('add-screen')).toBeVisible();
  });

  test('navigates to Profile screen when Perfil tab is tapped', async ({ page }) => {
    await page.getByTestId('nav-profile').click();
    await expect(page).toHaveURL('/perfil');
    await expect(page.getByTestId('profile-screen')).toBeVisible();
  });

  test('navigates to Settings screen when Config. tab is tapped', async ({ page }) => {
    await page.getByTestId('nav-settings').click();
    await expect(page).toHaveURL('/configuracoes');
    await expect(page.getByTestId('settings-screen')).toBeVisible();
  });

  test('highlights active tab in amber', async ({ page }) => {
    await expect(page.getByTestId('nav-home')).toHaveCSS('color', 'rgb(232, 160, 32)');
  });

  test('does not show horizontal scrollbar', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
