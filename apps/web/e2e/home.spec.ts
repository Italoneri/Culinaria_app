import { test, expect } from '@playwright/test';

test.describe('US-01 · Home feed', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // US-01.1 — Visualizar feed de receitas
  test.describe('feed layout', () => {
    test('displays hero featured card with "Receita da semana" badge', async ({ page }) => {
      const hero = page.getByTestId('featured-card');
      await expect(hero).toBeVisible();
      await expect(hero.getByText('Receita da semana')).toBeVisible();
    });

    test('displays "Salvas recentemente" section with up to 4 recipe cards', async ({ page }) => {
      const section = page.getByTestId('section-saved-recently');
      await expect(section).toBeVisible();
      const cards = section.getByTestId('recipe-card');
      await expect(cards).toHaveCount(4);
    });

    test('each recipe card shows category in amber, name, time and difficulty', async ({ page }) => {
      const card = page.getByTestId('recipe-card').first();
      await expect(card.getByTestId('recipe-category')).toBeVisible();
      await expect(card.getByTestId('recipe-name')).toBeVisible();
      await expect(card.getByTestId('recipe-time')).toBeVisible();
      await expect(card.getByTestId('recipe-difficulty')).toBeVisible();
    });

    test('displays "Para hoje à noite" horizontal scroll section with mini cards', async ({ page }) => {
      const section = page.getByTestId('section-tonight');
      await expect(section).toBeVisible();
      const miniCards = section.getByTestId('mini-card');
      await expect(miniCards).toHaveCount(await miniCards.count());
      expect(await miniCards.count()).toBeGreaterThan(0);
    });

    test('each mini card shows name, time and calories', async ({ page }) => {
      const card = page.getByTestId('mini-card').first();
      await expect(card.getByTestId('recipe-name')).toBeVisible();
      await expect(card.getByTestId('recipe-time')).toBeVisible();
      await expect(card.getByTestId('recipe-calories')).toBeVisible();
    });
  });

  // US-01.2 — Filtrar receitas por categoria
  test.describe('category filter', () => {
    test('"Todas" chip is selected by default on entry', async ({ page }) => {
      const allChip = page.getByTestId('category-chip-todas');
      await expect(allChip).toHaveAttribute('data-active', 'true');
    });

    test('tapping a category chip filters "Salvas recentemente" to that category only', async ({ page }) => {
      await page.getByTestId('category-chip-jantar').click();

      const cards = page.getByTestId('section-saved-recently').getByTestId('recipe-card');
      const count = await cards.count();
      for (let i = 0; i < count; i++) {
        await expect(cards.nth(i).getByTestId('recipe-category')).toHaveText('Jantar');
      }
    });

    test('active chip gets amber background and dark text', async ({ page }) => {
      const chip = page.getByTestId('category-chip-almoço');
      await chip.click();
      await expect(chip).toHaveAttribute('data-active', 'true');
      await expect(chip).toHaveCSS('background-color', 'rgb(232, 160, 32)');
      await expect(chip).toHaveCSS('color', 'rgb(13, 13, 13)');
    });

    test('tapping "Todas" restores the full list', async ({ page }) => {
      await page.getByTestId('category-chip-jantar').click();
      await page.getByTestId('category-chip-todas').click();

      const cards = page.getByTestId('section-saved-recently').getByTestId('recipe-card');
      await expect(cards).toHaveCount(4);
    });

    test('hero card is not affected by category filter', async ({ page }) => {
      const heroName = await page.getByTestId('featured-card').getByTestId('recipe-name').textContent();
      await page.getByTestId('category-chip-sobremesa').click();
      await expect(page.getByTestId('featured-card').getByTestId('recipe-name')).toHaveText(heroName!);
    });

    test('"Para hoje à noite" section is not affected by category filter', async ({ page }) => {
      const countBefore = await page.getByTestId('section-tonight').getByTestId('mini-card').count();
      await page.getByTestId('category-chip-snacks').click();
      const countAfter = await page.getByTestId('section-tonight').getByTestId('mini-card').count();
      expect(countAfter).toBe(countBefore);
    });

    test('category chips scroll horizontally without overflow', async ({ page }) => {
      const chipBar = page.getByTestId('category-chip-bar');
      const scrollWidth = await chipBar.evaluate((el) => el.scrollWidth);
      const clientWidth = await chipBar.evaluate((el) => el.clientWidth);
      expect(scrollWidth).toBeGreaterThanOrEqual(clientWidth);

      const overflowX = await chipBar.evaluate((el) => getComputedStyle(el).overflowX);
      expect(overflowX).toBe('auto');
    });
  });

  // US-01.3 — Buscar receita ou ingrediente
  test.describe('search', () => {
    test('search bar is visible below the headline', async ({ page }) => {
      await expect(page.getByTestId('search-bar')).toBeVisible();
      await expect(page.getByTestId('search-bar')).toHaveAttribute(
        'placeholder',
        'Buscar receita, ingrediente…',
      );
    });

    test('typing filters recipes in real time', async ({ page }) => {
      await page.getByTestId('search-bar').fill('risoto');
      const cards = page.getByTestId('section-saved-recently').getByTestId('recipe-card');
      await expect(cards).toHaveCount(1);
      await expect(cards.first().getByTestId('recipe-name')).toContainText('Risoto');
    });

    test('shows empty state with message and CTA when no results match', async ({ page }) => {
      await page.getByTestId('search-bar').fill('xyzxyzxyz_nonexistent');
      const emptyState = page.getByTestId('empty-state');
      await expect(emptyState).toBeVisible();
      await expect(emptyState).toContainText('Nenhuma receita encontrada para');
      await expect(emptyState).toContainText('xyzxyzxyz_nonexistent');
      await expect(emptyState.getByRole('button', { name: /explorar todas as receitas/i })).toBeVisible();
    });

    test('tapping "Explorar todas as receitas" CTA clears the search filter', async ({ page }) => {
      await page.getByTestId('search-bar').fill('xyzxyzxyz_nonexistent');
      await page.getByTestId('empty-state').getByRole('button', { name: /explorar todas as receitas/i }).click();
      const cards = page.getByTestId('section-saved-recently').getByTestId('recipe-card');
      await expect(cards).toHaveCount(4);
      await expect(page.getByTestId('search-bar')).toHaveValue('');
    });

    test('clearing search restores the full list', async ({ page }) => {
      await page.getByTestId('search-bar').fill('risoto');
      await page.getByTestId('search-bar').clear();
      const cards = page.getByTestId('section-saved-recently').getByTestId('recipe-card');
      await expect(cards).toHaveCount(4);
    });
  });

  // US-01.4 — Salvar receita do feed
  test.describe('save recipe from feed', () => {
    test('hero card has a bookmark button', async ({ page }) => {
      await expect(page.getByTestId('featured-card').getByRole('button', { name: /salvar/i })).toBeVisible();
    });

    test('recipe card has a bookmark button that does not navigate away', async ({ page }) => {
      const card = page.getByTestId('recipe-card').first();
      const bookmarkBtn = card.getByRole('button', { name: /salvar/i });
      await bookmarkBtn.click();
      await expect(page).toHaveURL('/');
    });

    test('bookmark icon becomes filled after saving', async ({ page }) => {
      const card = page.getByTestId('recipe-card').first();
      const bookmarkBtn = card.getByRole('button', { name: /salvar/i });
      await bookmarkBtn.click();
      await expect(bookmarkBtn).toHaveAttribute('data-saved', 'true');
    });
  });

  // US-01.5 — Saudação personalizada
  test.describe('personalised header', () => {
    test('shows the Saveur logo "S" mark', async ({ page }) => {
      await expect(page.getByTestId('logo-mark')).toBeVisible();
    });

    test('shows day of week and greeting with user name', async ({ page }) => {
      await expect(page.getByTestId('greeting-day')).toBeVisible();
      await expect(page.getByTestId('greeting-name')).toBeVisible();
    });
  });

  // US-01.6 — Ícone de notificações
  test.describe('notifications', () => {
    test('bell icon is visible with amber dot indicator', async ({ page }) => {
      const bellBtn = page.getByRole('button', { name: /notificações/i });
      await expect(bellBtn).toBeVisible();
      await expect(page.getByTestId('notification-dot')).toBeVisible();
    });
  });
});
