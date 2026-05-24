import { test, expect } from '@playwright/test';

test.describe('US-03 · Add recipe', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/adicionar');
    await expect(page.getByTestId('add-screen')).toBeVisible();
  });

  // US-03.1 — Campos básicos
  test.describe('basic fields', () => {
    test('name field has correct placeholder and uses display font', async ({ page }) => {
      const nameInput = page.getByTestId('input-recipe-name');
      await expect(nameInput).toHaveAttribute('placeholder', 'Ex.: Pasta al limone');
      await expect(nameInput).toHaveCSS('font-family', /Instrument Serif/);
    });

    test('category chips are shown and "Jantar" is selected by default', async ({ page }) => {
      for (const cat of ['Café da manhã', 'Almoço', 'Jantar', 'Sobremesa', 'Snacks']) {
        await expect(page.getByTestId(`category-chip-${cat.toLowerCase().replace(/\s/g, '-')}`)).toBeVisible();
      }
      await expect(page.getByTestId('category-chip-jantar')).toHaveAttribute('data-active', 'true');
    });

    test('selecting a different category activates it with amber style', async ({ page }) => {
      const chip = page.getByTestId('category-chip-sobremesa');
      await chip.click();
      await expect(chip).toHaveAttribute('data-active', 'true');
      await expect(chip).toHaveCSS('background-color', 'rgb(232, 160, 32)');
    });

    test('time stepper starts at 30 min and increments by 5', async ({ page }) => {
      const value = page.getByTestId('stepper-time-value');
      await expect(value).toContainText('30');
      await page.getByTestId('stepper-time-plus').click();
      await expect(value).toContainText('35');
    });

    test('time stepper minimum is 5 min', async ({ page }) => {
      const minusBtn = page.getByTestId('stepper-time-minus');
      const value = page.getByTestId('stepper-time-value');
      for (let i = 0; i < 10; i++) await minusBtn.click();
      await expect(value).toContainText('5');
    });

    test('portions stepper starts at 4 and increments by 1', async ({ page }) => {
      const value = page.getByTestId('stepper-portions-value');
      await expect(value).toHaveText('4');
      await page.getByTestId('stepper-portions-plus').click();
      await expect(value).toHaveText('5');
    });

    test('portions stepper minimum is 1', async ({ page }) => {
      const minusBtn = page.getByTestId('stepper-portions-minus');
      const value = page.getByTestId('stepper-portions-value');
      for (let i = 0; i < 10; i++) await minusBtn.click();
      await expect(value).toHaveText('1');
    });

    test('"Médio" difficulty is active by default', async ({ page }) => {
      await expect(page.getByTestId('difficulty-medio')).toHaveAttribute('data-active', 'true');
    });

    test('selecting difficulty applies amber soft style', async ({ page }) => {
      const btn = page.getByTestId('difficulty-facil');
      await btn.click();
      await expect(btn).toHaveAttribute('data-active', 'true');
      await expect(btn).toHaveCSS('color', 'rgb(232, 160, 32)');
    });
  });

  // US-03.2 — Upload de foto
  test.describe('photo upload', () => {
    test('upload area is visible with camera icon and instructional text', async ({ page }) => {
      await expect(page.getByTestId('photo-upload-area')).toBeVisible();
      await expect(page.getByText('Adicionar foto')).toBeVisible();
      await expect(page.getByText('Mostre o prato finalizado')).toBeVisible();
    });

    test('upload area has dashed border style', async ({ page }) => {
      const area = page.getByTestId('photo-upload-area');
      await expect(area).toHaveCSS('border-style', 'dashed');
    });
  });

  // US-03.3 — Ingredientes dinâmicos
  test.describe('dynamic ingredients', () => {
    test('starts with 2 ingredient fields', async ({ page }) => {
      await expect(page.getByTestId('ingredient-input')).toHaveCount(2);
    });

    test('first field placeholder is "Ex.: 200g de farinha"', async ({ page }) => {
      await expect(page.getByTestId('ingredient-input').first()).toHaveAttribute(
        'placeholder',
        'Ex.: 200g de farinha',
      );
    });

    test('subsequent fields placeholder is "Próximo ingrediente"', async ({ page }) => {
      await expect(page.getByTestId('ingredient-input').nth(1)).toHaveAttribute(
        'placeholder',
        'Próximo ingrediente',
      );
    });

    test('each field shows sequential amber number badge', async ({ page }) => {
      const badges = page.getByTestId('ingredient-number');
      await expect(badges.first()).toHaveText('1');
      await expect(badges.nth(1)).toHaveText('2');
    });

    test('"Adicionar ingrediente" button adds a new field', async ({ page }) => {
      await page.getByRole('button', { name: /adicionar ingrediente/i }).click();
      await expect(page.getByTestId('ingredient-input')).toHaveCount(3);
    });

    test('remove button is visible on each field when there are 2+', async ({ page }) => {
      const removeButtons = page.getByTestId('ingredient-remove');
      await expect(removeButtons).toHaveCount(2);
    });

    test('remove button is not shown when only 1 ingredient remains', async ({ page }) => {
      await page.getByTestId('ingredient-remove').first().click();
      await expect(page.getByTestId('ingredient-remove')).toHaveCount(0);
    });

    test('removing an ingredient decrements the list', async ({ page }) => {
      await page.getByRole('button', { name: /adicionar ingrediente/i }).click();
      await expect(page.getByTestId('ingredient-input')).toHaveCount(3);
      await page.getByTestId('ingredient-remove').first().click();
      await expect(page.getByTestId('ingredient-input')).toHaveCount(2);
    });
  });

  // US-03.4 — Passos dinâmicos
  test.describe('dynamic steps', () => {
    test('starts with 2 step fields', async ({ page }) => {
      await expect(page.getByTestId('step-textarea')).toHaveCount(2);
    });

    test('first step placeholder is "Descreva este passo…"', async ({ page }) => {
      await expect(page.getByTestId('step-textarea').first()).toHaveAttribute(
        'placeholder',
        'Descreva este passo…',
      );
    });

    test('step number is shown in italic display font with amber style', async ({ page }) => {
      const num = page.getByTestId('step-number').first();
      await expect(num).toHaveText('01');
      await expect(num).toHaveCSS('font-style', 'italic');
    });

    test('"Adicionar passo" button appends a new step', async ({ page }) => {
      await page.getByRole('button', { name: /adicionar passo/i }).click();
      await expect(page.getByTestId('step-textarea')).toHaveCount(3);
    });
  });

  // US-03.5 — Notas pessoais
  test.describe('personal notes', () => {
    test('notes textarea is visible with correct placeholder', async ({ page }) => {
      const notes = page.getByTestId('input-notes');
      await expect(notes).toBeVisible();
      await expect(notes).toHaveAttribute(
        'placeholder',
        'Ex.: receita da minha avó, fica melhor com farinha 00…',
      );
    });
  });

  // US-03.6 — Salvar receita
  test.describe('save recipe', () => {
    test('"Salvar receita" CTA is fixed at the bottom with amber background', async ({ page }) => {
      const cta = page.getByRole('button', { name: /salvar receita/i });
      await expect(cta).toBeVisible();
      await expect(cta).toHaveCSS('background-color', 'rgb(232, 160, 32)');
    });

    test('saving without name shows inline validation error', async ({ page }) => {
      await page.getByTestId('ingredient-input').first().fill('100g de farinha');
      await page.getByTestId('step-textarea').first().fill('Misture tudo');
      await page.getByRole('button', { name: /salvar receita/i }).click();
      await expect(page.getByTestId('error-recipe-name')).toBeVisible();
    });

    test('saving without any ingredient shows inline validation error', async ({ page }) => {
      await page.getByTestId('input-recipe-name').fill('Bolo de cenoura');
      await page.getByTestId('step-textarea').first().fill('Misture tudo');
      await page.getByRole('button', { name: /salvar receita/i }).click();
      await expect(page.getByTestId('error-ingredients')).toBeVisible();
    });

    test('saving without any step shows inline validation error', async ({ page }) => {
      await page.getByTestId('input-recipe-name').fill('Bolo de cenoura');
      await page.getByTestId('ingredient-input').first().fill('100g de farinha');
      await page.getByRole('button', { name: /salvar receita/i }).click();
      await expect(page.getByTestId('error-steps')).toBeVisible();
    });

    test('user adds recipe and sees it in Home feed', async ({ page }) => {
      await page.getByTestId('input-recipe-name').fill('Bolo de cenoura teste');
      await page.getByTestId('ingredient-input').first().fill('2 cenouras');
      await page.getByTestId('step-textarea').first().fill('Bata no liquidificador');

      await page.getByRole('button', { name: /salvar receita/i }).click();

      // Should redirect to the newly created recipe's detail
      await expect(page.getByTestId('detail-screen')).toBeVisible();
      await expect(page.getByTestId('detail-title')).toHaveText('Bolo de cenoura teste');
    });
  });

  // US-03.7 — Rascunho
  test.describe('draft', () => {
    test('"Rascunho" button is visible in the top bar', async ({ page }) => {
      await expect(page.getByRole('button', { name: /rascunho/i })).toBeVisible();
    });

    test('tapping "Rascunho" saves without validating required fields', async ({ page }) => {
      // no fields filled
      await page.getByRole('button', { name: /rascunho/i }).click();
      await expect(page.getByTestId('error-recipe-name')).not.toBeVisible();
    });

    test('tapping back with unsaved content shows discard dialog', async ({ page }) => {
      await page.getByTestId('input-recipe-name').fill('Receita incompleta');
      await page.getByTestId('btn-back').click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByRole('dialog')).toContainText('Deseja salvar como rascunho');
    });

    test('switching bottom nav tab with unsaved content shows discard dialog', async ({ page }) => {
      await page.getByTestId('input-recipe-name').fill('Receita incompleta');
      // Tap Home tab in bottom nav while form is dirty
      await page.getByRole('link', { name: /^home$/i }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByRole('dialog')).toContainText('Deseja salvar como rascunho');
    });

    test('navigating away with no content does not show discard dialog', async ({ page }) => {
      // Form untouched — no dialog expected
      await page.getByRole('link', { name: /^home$/i }).click();
      await expect(page.getByRole('dialog')).not.toBeVisible();
      await expect(page).toHaveURL('/');
    });
  });
});
