import { test, expect } from '@playwright/test';

// Design token values from docs/design/saveur-handoff/data.js
const TOKENS = {
  bg: 'rgb(13, 13, 13)',
  card: 'rgb(26, 26, 26)',
  amber: 'rgb(232, 160, 32)',
  textPrimary: 'rgb(245, 242, 236)',
} as const;

test.describe('Visual — design token adherence', () => {
  test('Home: page background matches #0D0D0D', async ({ page }) => {
    await page.goto('/');
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe(TOKENS.bg);
  });

  test('Home: recipe cards have #1A1A1A background', async ({ page }) => {
    await page.goto('/');
    const card = page.getByTestId('recipe-card').first();
    await expect(card).toHaveCSS('background-color', TOKENS.card);
  });

  test('Home: active category chip background is amber #E8A020', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('category-chip-todas')).toHaveCSS('background-color', TOKENS.amber);
  });

  test('Home: Instrument Serif is loaded (display font renders)', async ({ page }) => {
    await page.goto('/');
    const fontFamily = await page.getByTestId('home-headline').evaluate(
      (el) => getComputedStyle(el).fontFamily,
    );
    expect(fontFamily).toMatch(/Instrument Serif/i);
  });

  test('Home: Manrope is loaded (UI font renders)', async ({ page }) => {
    await page.goto('/');
    const fontFamily = await page.getByTestId('category-chip-todas').evaluate(
      (el) => getComputedStyle(el).fontFamily,
    );
    expect(fontFamily).toMatch(/Manrope/i);
  });

  test('Detail: hero image height is at least 380px', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('featured-card').click();
    const hero = page.getByTestId('detail-hero');
    const box = await hero.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(380);
  });

  test('Detail: active tab has amber background', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('featured-card').click();
    await expect(page.getByTestId('tab-ingredients')).toHaveCSS('background-color', TOKENS.amber);
  });

  test('Detail: CTA button is amber #E8A020', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('featured-card').click();
    await expect(page.getByRole('button', { name: /iniciar preparo/i })).toHaveCSS(
      'background-color',
      TOKENS.amber,
    );
  });

  test('Add: page background matches #0D0D0D', async ({ page }) => {
    await page.goto('/adicionar');
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe(TOKENS.bg);
  });

  test('Add: "Salvar receita" CTA is amber', async ({ page }) => {
    await page.goto('/adicionar');
    await expect(page.getByRole('button', { name: /salvar receita/i })).toHaveCSS(
      'background-color',
      TOKENS.amber,
    );
  });

  test('Profile: avatar has circular border-radius', async ({ page }) => {
    await page.goto('/perfil');
    await expect(page.getByTestId('profile-avatar')).toHaveCSS('border-radius', '50%');
  });

  test('Profile: camera button on avatar is amber', async ({ page }) => {
    await page.goto('/perfil');
    await expect(page.getByTestId('btn-change-avatar')).toHaveCSS('background-color', TOKENS.amber);
  });

  test('Profile: "Favoritas" stat card uses amber text', async ({ page }) => {
    await page.goto('/perfil');
    await expect(page.getByTestId('stat-favorites')).toHaveCSS('color', TOKENS.amber);
  });

  test('Bottom nav: "+" button is amber', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /adicionar receita/i })).toHaveCSS(
      'background-color',
      TOKENS.amber,
    );
  });

  test('Bottom nav: active tab icon color is amber', async ({ page }) => {
    await page.goto('/');
    const homeTab = page.getByRole('link', { name: /^home$/i });
    await expect(homeTab).toHaveCSS('color', TOKENS.amber);
  });

  test('no horizontal scrollbar on any main screen', async ({ page }) => {
    for (const route of ['/', '/adicionar', '/perfil']) {
      await page.goto(route);
      const hasHorizScroll = await page.evaluate(
        () => document.body.scrollWidth > document.body.clientWidth,
      );
      expect(hasHorizScroll, `Horizontal overflow on ${route}`).toBe(false);
    }
  });

  test('content does not clip under bottom nav (paddingBottom >= 110px)', async ({ page }) => {
    for (const route of ['/', '/profile']) {
      await page.goto(route);
      const paddingBottom = await page.getByTestId(route === '/' ? 'home-screen' : 'profile-screen')
        .evaluate((el) => parseInt(getComputedStyle(el).paddingBottom, 10));
      expect(paddingBottom, `paddingBottom on ${route}`).toBeGreaterThanOrEqual(110);
    }
  });
});
