import { test, expect } from '@playwright/test';

test.describe('US-05 · Listagem de receitas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/receitas');
  });

  // US-05.1 — Layout inicial
  test.describe('layout inicial', () => {
    test('exibe tela de receitas com título', async ({ page }) => {
      await expect(page.getByTestId('receitas-screen')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Receitas' })).toBeVisible();
    });

    test('exibe grid de receitas na carga inicial', async ({ page }) => {
      const list = page.getByTestId('recipe-list');
      await expect(list).toBeVisible();
      expect(await list.getByTestId('recipe-card').count()).toBeGreaterThan(0);
    });

    test('cada card exibe categoria, nome, tempo e dificuldade', async ({ page }) => {
      const card = page.getByTestId('recipe-list').getByTestId('recipe-card').first();
      await expect(card.getByTestId('recipe-category')).toBeVisible();
      await expect(card.getByTestId('recipe-name')).toBeVisible();
      await expect(card.getByTestId('recipe-time')).toBeVisible();
      await expect(card.getByTestId('recipe-difficulty')).toBeVisible();
    });

    test('exibe campo de busca visível', async ({ page }) => {
      await expect(page.getByTestId('search-input')).toBeVisible();
    });

    test('chip "Todas" está ativo por padrão', async ({ page }) => {
      await expect(page.getByTestId('category-chip-todas')).toHaveAttribute('data-active', 'true');
    });
  });

  // US-05.2 — Navegação via bottom nav
  test.describe('navegação', () => {
    test('tab Receitas no bottom nav navega para /receitas', async ({ page }) => {
      await page.goto('/');
      await page.getByTestId('nav-recipes').click();
      await expect(page).toHaveURL('/receitas');
      await expect(page.getByTestId('receitas-screen')).toBeVisible();
    });

    test('tab Receitas fica ativo em amber quando em /receitas', async ({ page }) => {
      await expect(page.getByTestId('nav-recipes')).toHaveCSS('color', 'rgb(232, 160, 32)');
    });

    test('clicar em card navega para página de detalhe', async ({ page }) => {
      await page.getByTestId('recipe-list').getByTestId('recipe-card').first().click();
      await expect(page).toHaveURL(/\/receita\/.+/);
    });
  });

  // US-05.3 — Filtro por categoria
  test.describe('filtro por categoria', () => {
    test('selecionar categoria filtra lista para aquela categoria', async ({ page }) => {
      await page.getByTestId('category-chip-jantar').click();

      const cards = page.getByTestId('recipe-list').getByTestId('recipe-card');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        await expect(cards.nth(i).getByTestId('recipe-category')).toHaveText('Jantar');
      }
    });

    test('chip ativo recebe fundo amber e texto escuro', async ({ page }) => {
      const chip = page.getByTestId('category-chip-almoco');
      await chip.click();
      await expect(chip).toHaveAttribute('data-active', 'true');
      await expect(chip).toHaveCSS('background-color', 'rgb(232, 160, 32)');
      await expect(chip).toHaveCSS('color', 'rgb(13, 13, 13)');
    });

    test('chip anterior fica inativo ao selecionar novo', async ({ page }) => {
      await page.getByTestId('category-chip-jantar').click();
      await page.getByTestId('category-chip-almoco').click();
      await expect(page.getByTestId('category-chip-jantar')).toHaveAttribute('data-active', 'false');
    });

    test('chip "Todas" restaura lista completa', async ({ page }) => {
      const totalCount = await page.getByTestId('recipe-list').getByTestId('recipe-card').count();
      await page.getByTestId('category-chip-jantar').click();
      await page.getByTestId('category-chip-todas').click();
      await expect(page.getByTestId('recipe-list').getByTestId('recipe-card')).toHaveCount(totalCount);
    });

    test('chips de categoria são horizontalmente scrolláveis', async ({ page }) => {
      const chipBar = page.locator('[data-testid^="category-chip-"]').first().locator('..');
      const overflowX = await chipBar.evaluate(el => getComputedStyle(el.parentElement!).overflowX);
      expect(['auto', 'scroll']).toContain(overflowX);
    });
  });

  // US-05.4 — Busca
  test.describe('busca', () => {
    test('filtrar por nome retorna receitas correspondentes', async ({ page }) => {
      await page.getByTestId('search-input').fill('risoto');
      const cards = page.getByTestId('recipe-list').getByTestId('recipe-card');
      await expect(cards).toHaveCount(1);
      await expect(cards.first().getByTestId('recipe-name')).toContainText('Risoto');
    });

    test('busca é case-insensitive', async ({ page }) => {
      await page.getByTestId('search-input').fill('SALMÃO');
      const cards = page.getByTestId('recipe-list').getByTestId('recipe-card');
      await expect(cards).toHaveCount(1);
    });

    test('busca sem resultados exibe estado vazio', async ({ page }) => {
      await page.getByTestId('search-input').fill('xyzxyz_nonexistent');
      await expect(page.getByTestId('empty-state')).toBeVisible();
      await expect(page.getByTestId('empty-state')).toContainText('Nenhuma receita encontrada');
      await expect(page.getByTestId('recipe-list')).not.toBeVisible();
    });

    test('limpar busca restaura lista completa', async ({ page }) => {
      const totalCount = await page.getByTestId('recipe-list').getByTestId('recipe-card').count();
      await page.getByTestId('search-input').fill('risoto');
      await page.getByTestId('search-input').clear();
      await expect(page.getByTestId('recipe-list').getByTestId('recipe-card')).toHaveCount(totalCount);
    });

    test('filtro de categoria e busca atuam em conjunto', async ({ page }) => {
      await page.getByTestId('category-chip-almoco').click();
      await page.getByTestId('search-input').fill('xyzxyz_nonexistent');
      await expect(page.getByTestId('empty-state')).toBeVisible();
    });
  });
});
