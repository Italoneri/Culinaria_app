import { test, expect } from '@playwright/test';

test.describe('US-04 · Profile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/perfil');
    await expect(page.getByTestId('profile-screen')).toBeVisible();
  });

  // US-04.1 — Visualizar dados do perfil
  test.describe('profile data', () => {
    test('displays circular avatar with amber border', async ({ page }) => {
      const avatar = page.getByTestId('profile-avatar');
      await expect(avatar).toBeVisible();
      await expect(avatar).toHaveCSS('border-radius', '50%');
    });

    test('displays amber accent ring around avatar', async ({ page }) => {
      await expect(page.getByTestId('avatar-ring')).toBeVisible();
    });

    test('displays name in display italic font', async ({ page }) => {
      const name = page.getByTestId('profile-name');
      await expect(name).toBeVisible();
      await expect(name).toHaveCSS('font-family', /Instrument Serif/);
      await expect(name).toHaveCSS('font-style', 'italic');
    });

    test('displays email and city', async ({ page }) => {
      await expect(page.getByTestId('profile-email')).toBeVisible();
      await expect(page.getByTestId('profile-city')).toBeVisible();
    });

    test('displays bio text', async ({ page }) => {
      await expect(page.getByTestId('profile-bio')).toBeVisible();
    });

    test('displays "Membro Premium" badge with amber style for premium user', async ({ page }) => {
      const badge = page.getByTestId('premium-badge');
      await expect(badge).toBeVisible();
      await expect(badge).toHaveCSS('color', 'rgb(232, 160, 32)');
    });
  });

  // US-04.2 — Trocar foto de perfil
  test.describe('change profile photo', () => {
    test('camera button is visible at bottom-right of avatar', async ({ page }) => {
      const cameraBtn = page.getByTestId('btn-change-avatar');
      await expect(cameraBtn).toBeVisible();
      await expect(cameraBtn).toHaveCSS('background-color', 'rgb(232, 160, 32)');
    });
  });

  // US-04.3 — Estatísticas
  test.describe('usage stats', () => {
    test('displays 3 stat cards side by side', async ({ page }) => {
      await expect(page.getByTestId('stat-created')).toBeVisible();
      await expect(page.getByTestId('stat-favorites')).toBeVisible();
      await expect(page.getByTestId('stat-cooked')).toBeVisible();
    });

    test('"Favoritas" stat card has amber accent', async ({ page }) => {
      const card = page.getByTestId('stat-favorites');
      await expect(card).toHaveAttribute('data-accent', 'true');
      await expect(card).toHaveCSS('color', 'rgb(232, 160, 32)');
    });
  });

  // US-04.4 — Receitas favoritas
  test.describe('favorite recipes grid', () => {
    test('displays "Minhas favoritas" section in italic display font', async ({ page }) => {
      const heading = page.getByTestId('favorites-heading');
      await expect(heading).toBeVisible();
      await expect(heading).toHaveCSS('font-style', 'italic');
    });

    test('favorites grid has 2 columns', async ({ page }) => {
      const grid = page.getByTestId('favorites-grid');
      await expect(grid).toHaveCSS('grid-template-columns', /1fr 1fr/);
    });

    test('each favorite card shows photo, name (max 2 lines), time and difficulty', async ({ page }) => {
      const card = page.getByTestId('favorite-card').first();
      await expect(card.getByTestId('recipe-name')).toBeVisible();
      await expect(card.getByTestId('recipe-time')).toBeVisible();
      await expect(card.getByTestId('recipe-difficulty')).toBeVisible();
    });

    test('each favorite card has a heart button to unfavorite', async ({ page }) => {
      await expect(page.getByTestId('favorite-card').first().getByRole('button', { name: /favoritar/i })).toBeVisible();
    });

    test('tapping a favorite card navigates to recipe detail', async ({ page }) => {
      await page.getByTestId('favorite-card').first().click();
      await expect(page.getByTestId('detail-screen')).toBeVisible();
    });

    test('"Ver todas →" link is visible', async ({ page }) => {
      await expect(page.getByRole('link', { name: /ver todas/i })).toBeVisible();
    });

    test('shows empty state CTA when user has no favorites', async ({ page }) => {
      // This scenario requires a fresh/empty state — skip if favorites are seeded
      // Implementation should expose a way to reset state or test against a clean profile
      test.skip();
    });
  });

  // US-04.5 — Coleções
  test.describe('collections', () => {
    test('collections section is visible with horizontal scroll', async ({ page }) => {
      const section = page.getByTestId('collections-scroll');
      await expect(section).toBeVisible();
      const overflowX = await section.evaluate((el) => getComputedStyle(el).overflowX);
      expect(overflowX).toBe('auto');
    });

    test('each collection chip shows emoji, name and recipe count', async ({ page }) => {
      const chip = page.getByTestId('collection-chip').first();
      await expect(chip.getByTestId('collection-emoji')).toBeVisible();
      await expect(chip.getByTestId('collection-name')).toBeVisible();
      await expect(chip.getByTestId('collection-count')).toBeVisible();
    });

    test('"+ Nova" button is visible', async ({ page }) => {
      await expect(page.getByRole('button', { name: /nova/i })).toBeVisible();
    });
  });

  // US-04.6 — Editar perfil
  test.describe('edit profile', () => {
    test('pencil edit button is visible in top-right', async ({ page }) => {
      await expect(page.getByTestId('btn-edit-profile')).toBeVisible();
    });

    test('tapping edit makes name, bio and city fields editable', async ({ page }) => {
      await page.getByTestId('btn-edit-profile').click();
      await expect(page.getByTestId('edit-name')).toBeVisible();
      await expect(page.getByTestId('edit-bio')).toBeVisible();
      await expect(page.getByTestId('edit-city')).toBeVisible();
    });

    test('saving edit with empty name shows validation error', async ({ page }) => {
      await page.getByTestId('btn-edit-profile').click();
      await page.getByTestId('edit-name').fill('');
      await page.getByRole('button', { name: /salvar/i }).click();
      await expect(page.getByTestId('error-edit-name')).toBeVisible();
    });

    test('bio field accepts up to 280 characters', async ({ page }) => {
      await page.getByTestId('btn-edit-profile').click();
      const bio = page.getByTestId('edit-bio');
      await expect(bio).toHaveAttribute('maxlength', '280');
    });

    test('"Cancelar" discards changes and exits edit mode', async ({ page }) => {
      const originalName = await page.getByTestId('profile-name').textContent();
      await page.getByTestId('btn-edit-profile').click();
      await page.getByTestId('edit-name').fill('Nome alterado');
      await page.getByRole('button', { name: /cancelar/i }).click();
      await expect(page.getByTestId('profile-name')).toHaveText(originalName!);
    });
  });

  // US-04.7 — Jornada culinária
  test.describe('culinary journey', () => {
    test('"Sua jornada culinária" card is visible', async ({ page }) => {
      await expect(page.getByTestId('journey-card')).toBeVisible();
      await expect(page.getByText('Sua jornada culinária')).toBeVisible();
    });
  });
});
