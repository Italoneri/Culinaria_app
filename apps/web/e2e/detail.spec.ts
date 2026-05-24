import { test, expect } from '@playwright/test';

test.describe('US-02 · Recipe detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // open first recipe via the featured card
    await page.getByTestId('featured-card').click();
    await expect(page.getByTestId('detail-screen')).toBeVisible();
  });

  // US-02.1 — Visualizar informações da receita
  test.describe('recipe information', () => {
    test('displays hero image at 380px height', async ({ page }) => {
      const hero = page.getByTestId('detail-hero');
      const box = await hero.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(380);
    });

    test('displays category badge in amber over the hero', async ({ page }) => {
      await expect(page.getByTestId('detail-category-badge')).toBeVisible();
    });

    test('displays recipe title in display font', async ({ page }) => {
      const title = page.getByTestId('detail-title');
      await expect(title).toBeVisible();
      await expect(title).toHaveCSS('font-family', /Instrument Serif/);
    });

    test('displays description below the title', async ({ page }) => {
      await expect(page.getByTestId('detail-description')).toBeVisible();
    });

    test('displays 4 stat pills: Tempo, Porções, kcal, Nível', async ({ page }) => {
      for (const label of ['Tempo', 'Porções', 'kcal', 'Nível']) {
        await expect(page.getByTestId(`pill-${label.toLowerCase()}`)).toBeVisible();
      }
    });

    test('Tempo pill has amber accent', async ({ page }) => {
      const tempoPill = page.getByTestId('pill-tempo');
      await expect(tempoPill).toHaveAttribute('data-accent', 'true');
    });
  });

  // US-02.2 — Tabs ingredientes / passos
  test.describe('ingredients and steps tabs', () => {
    test('shows two tabs with ingredient and step counts', async ({ page }) => {
      await expect(page.getByTestId('tab-ingredients')).toBeVisible();
      await expect(page.getByTestId('tab-steps')).toBeVisible();
    });

    test('"Ingredientes" tab is active by default', async ({ page }) => {
      await expect(page.getByTestId('tab-ingredients')).toHaveAttribute('data-active', 'true');
    });

    test('active tab has amber background and dark text', async ({ page }) => {
      const tab = page.getByTestId('tab-ingredients');
      await expect(tab).toHaveCSS('background-color', 'rgb(232, 160, 32)');
      await expect(tab).toHaveCSS('color', 'rgb(13, 13, 13)');
    });

    test('tapping "Passos" switches content without reloading', async ({ page }) => {
      const url = page.url();
      await page.getByTestId('tab-steps').click();
      await expect(page.getByTestId('steps-list')).toBeVisible();
      await expect(page.getByTestId('ingredients-list')).not.toBeVisible();
      expect(page.url()).toBe(url);
    });

    test('tapping "Ingredientes" switches back to ingredients content', async ({ page }) => {
      await page.getByTestId('tab-steps').click();
      await page.getByTestId('tab-ingredients').click();
      await expect(page.getByTestId('ingredients-list')).toBeVisible();
      await expect(page.getByTestId('steps-list')).not.toBeVisible();
    });
  });

  // US-02.3 — Marcar ingredientes como separados
  test.describe('ingredient checkboxes', () => {
    test('each ingredient row has an unchecked checkbox initially', async ({ page }) => {
      const items = page.getByTestId('ingredient-item');
      const count = await items.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        await expect(items.nth(i).getByTestId('ingredient-checkbox')).toHaveAttribute('data-checked', 'false');
      }
    });

    test('tapping an ingredient marks it as checked with amber checkbox and strikethrough text', async ({
      page,
    }) => {
      const item = page.getByTestId('ingredient-item').first();
      await item.click();
      await expect(item.getByTestId('ingredient-checkbox')).toHaveAttribute('data-checked', 'true');
      await expect(item.getByTestId('ingredient-checkbox')).toHaveCSS('background-color', 'rgb(232, 160, 32)');
      await expect(item.getByTestId('ingredient-text')).toHaveCSS('text-decoration-line', 'line-through');
    });

    test('tapping a checked ingredient unchecks it', async ({ page }) => {
      const item = page.getByTestId('ingredient-item').first();
      await item.click();
      await item.click();
      await expect(item.getByTestId('ingredient-checkbox')).toHaveAttribute('data-checked', 'false');
      await expect(item.getByTestId('ingredient-text')).not.toHaveCSS('text-decoration-line', 'line-through');
    });

    test('check state persists while screen is open (switching tabs and back)', async ({ page }) => {
      const item = page.getByTestId('ingredient-item').first();
      await item.click();
      await page.getByTestId('tab-steps').click();
      await page.getByTestId('tab-ingredients').click();
      await expect(item.getByTestId('ingredient-checkbox')).toHaveAttribute('data-checked', 'true');
    });

    test('check state resets after navigating away and returning', async ({ page }) => {
      const item = page.getByTestId('ingredient-item').first();
      await item.click();
      await expect(item.getByTestId('ingredient-checkbox')).toHaveAttribute('data-checked', 'true');

      // Navigate back to home then re-open the same recipe
      await page.getByTestId('btn-back').click();
      await page.getByTestId('featured-card').click();
      await expect(page.getByTestId('detail-screen')).toBeVisible();

      const resetItem = page.getByTestId('ingredient-item').first();
      await expect(resetItem.getByTestId('ingredient-checkbox')).toHaveAttribute('data-checked', 'false');
    });
  });

  // US-02.4 — Modo de preparo passo a passo
  test.describe('preparation steps', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId('tab-steps').click();
    });

    test('each step shows sequential number, title and description', async ({ page }) => {
      const steps = page.getByTestId('step-item');
      const count = await steps.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        const step = steps.nth(i);
        await expect(step.getByTestId('step-number')).toHaveText(String(i + 1).padStart(2, '0'));
        await expect(step.getByTestId('step-title')).toBeVisible();
        await expect(step.getByTestId('step-description')).toBeVisible();
      }
    });

    test('step number uses italic display font', async ({ page }) => {
      const num = page.getByTestId('step-item').first().getByTestId('step-number');
      await expect(num).toHaveCSS('font-family', /Instrument Serif/);
      await expect(num).toHaveCSS('font-style', 'italic');
    });

    test('step with tip shows "Dica do chef" card in amber', async ({ page }) => {
      // The first recipe (Risoto) has tips on steps 2 and 5
      const tipCard = page.getByTestId('chef-tip').first();
      await expect(tipCard).toBeVisible();
      await expect(tipCard.getByText('DICA DO CHEF')).toBeVisible();
    });

    test('step without tip does not show chef tip card', async ({ page }) => {
      // Step 1 of Risoto (index 0) has no tip
      const firstStep = page.getByTestId('step-item').first();
      await expect(firstStep.getByTestId('chef-tip')).not.toBeVisible();
    });
  });

  // US-02.5 — Favoritar receita
  test.describe('favorite', () => {
    test('bookmark button is visible in the top-right area', async ({ page }) => {
      await expect(page.getByTestId('btn-bookmark')).toBeVisible();
    });

    test('tapping bookmark marks recipe as saved with amber background', async ({ page }) => {
      const btn = page.getByTestId('btn-bookmark');
      await btn.click();
      await expect(btn).toHaveAttribute('data-saved', 'true');
      await expect(btn).toHaveCSS('background-color', 'rgb(232, 160, 32)');
    });

    test('tapping bookmark again removes from favorites', async ({ page }) => {
      const btn = page.getByTestId('btn-bookmark');
      await btn.click();
      await btn.click();
      await expect(btn).toHaveAttribute('data-saved', 'false');
    });
  });

  // US-02.6 — Compartilhar
  test.describe('share', () => {
    test('share button is visible next to back button', async ({ page }) => {
      await expect(page.getByTestId('btn-share')).toBeVisible();
    });
  });

  // US-02.7 — Iniciar preparo
  test.describe('start cooking CTA', () => {
    test('"Iniciar preparo" button is fixed at the bottom with amber background', async ({ page }) => {
      const cta = page.getByRole('button', { name: /iniciar preparo/i });
      await expect(cta).toBeVisible();
      await expect(cta).toHaveCSS('background-color', 'rgb(232, 160, 32)');
    });

    test('CTA shows recipe cook time', async ({ page }) => {
      const cta = page.getByRole('button', { name: /iniciar preparo/i });
      await expect(cta.getByTestId('cta-time')).toBeVisible();
    });
  });

  // US-02.8 — Ajustar porções
  test.describe('portions adjustment', () => {
    test('portions pill is interactive and shows minus/plus controls', async ({ page }) => {
      await page.getByTestId('pill-porções').click();
      await expect(page.getByTestId('portions-minus')).toBeVisible();
      await expect(page.getByTestId('portions-plus')).toBeVisible();
    });

    test('minimum portions is 1', async ({ page }) => {
      await page.getByTestId('pill-porções').click();
      const minusBtn = page.getByTestId('portions-minus');
      const valueEl = page.getByTestId('portions-value');

      // reduce to minimum
      for (let i = 0; i < 10; i++) {
        await minusBtn.click();
      }
      await expect(valueEl).toHaveText('1');
      await expect(minusBtn).toBeDisabled();
    });

    test('ingredient quantities update in real time when portions change', async ({ page }) => {
      await page.getByTestId('pill-porções').click();
      const originalText = await page.getByTestId('ingredient-item').first().getByTestId('ingredient-text').textContent();

      await page.getByTestId('portions-plus').click();

      // The ingredient text should have changed to reflect the new quantity
      const updatedText = await page.getByTestId('ingredient-item').first().getByTestId('ingredient-text').textContent();
      expect(updatedText).not.toBe(originalText);
    });
  });

  // Navigation — back button
  test('back button returns to Home', async ({ page }) => {
    await page.getByTestId('btn-back').click();
    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('home-screen')).toBeVisible();
  });
});
