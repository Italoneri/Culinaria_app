import { test as setup, expect } from '@playwright/test';

export const AUTH_STATE_PATH = 'e2e/.auth/user.json';

/**
 * Roda uma vez antes da suíte e grava o storageState que os specs herdam.
 *
 * Sem isto o middleware manda /adicionar e /perfil para o login e as specs
 * dessas telas expiram procurando um testid que nunca aparece.
 */
setup('autentica o usuário de teste', async ({ page }) => {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;

  // Falhar aqui, alto e claro, é melhor que rodar a suíte inteira deslogada e
  // culpar o app pelos timeouts.
  if (!email || !password) {
    throw new Error(
      'E2E_EMAIL e E2E_PASSWORD não estão definidos. Crie a conta em /auth/cadastro, ' +
      'rode supabase/seed.sql para ela e exporte as duas variáveis antes de `pnpm test:e2e`.'
    );
  }

  await page.goto('/auth/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Senha').fill(password);
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByTestId('home-screen')).toBeVisible();

  await page.context().storageState({ path: AUTH_STATE_PATH });
});
