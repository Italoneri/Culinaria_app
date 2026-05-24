# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: add-recipe.spec.ts >> US-03 · Add recipe >> save recipe >> user adds recipe and sees it in Home feed
- Location: e2e\add-recipe.spec.ts:200:9

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /salvar receita/i })
    - locator resolved to <button>…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <path stroke-width="2" d="M12 5v14M5 12h14" stroke="currentColor" stroke-linecap="round"></path> from <nav role="navigation" aria-label="navegação principal">…</nav> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <path stroke-width="2" d="M12 5v14M5 12h14" stroke="currentColor" stroke-linecap="round"></path> from <nav role="navigation" aria-label="navegação principal">…</nav> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    55 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <path stroke-width="2" d="M12 5v14M5 12h14" stroke="currentColor" stroke-linecap="round"></path> from <nav role="navigation" aria-label="navegação principal">…</nav> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - button [ref=e6] [cursor=pointer]:
            - img [ref=e7]
          - generic [ref=e9]: Nova receita
          - button "Rascunho" [ref=e10] [cursor=pointer]
        - generic [ref=e12] [cursor=pointer]:
          - img [ref=e14]
          - generic [ref=e17]:
            - generic [ref=e18]: Adicionar foto
            - generic [ref=e19]: Mostre o prato finalizado
        - generic [ref=e20]:
          - generic [ref=e22]: Nome da receita
          - 'textbox "Ex.: Pasta al limone" [ref=e24]': Bolo de cenoura teste
        - generic [ref=e25]:
          - generic [ref=e27]: Categoria
          - generic [ref=e28]:
            - button "Café da manhã" [ref=e29] [cursor=pointer]
            - button "Almoço" [ref=e30] [cursor=pointer]
            - button "Jantar" [ref=e31] [cursor=pointer]
            - button "Sobremesa" [ref=e32] [cursor=pointer]
            - button "Snacks" [ref=e33] [cursor=pointer]
        - generic [ref=e34]:
          - generic [ref=e36]: Detalhes
          - generic [ref=e37]:
            - generic [ref=e38]:
              - generic [ref=e39]:
                - img [ref=e40]
                - text: Tempo
              - generic [ref=e43]:
                - button [ref=e44] [cursor=pointer]:
                  - img [ref=e45]
                - generic [ref=e46]:
                  - generic [ref=e47]: "30"
                  - generic [ref=e48]: min
                - button [ref=e49] [cursor=pointer]:
                  - img [ref=e50]
            - generic [ref=e52]:
              - generic [ref=e53]:
                - img [ref=e54]
                - text: Porções
              - generic [ref=e58]:
                - button [ref=e59] [cursor=pointer]:
                  - img [ref=e60]
                - generic [ref=e62]: "4"
                - button [ref=e63] [cursor=pointer]:
                  - img [ref=e64]
          - generic [ref=e66]:
            - button "Fácil" [ref=e67] [cursor=pointer]:
              - img [ref=e68]
              - text: Fácil
            - button "Médio" [ref=e70] [cursor=pointer]:
              - img [ref=e71]
              - text: Médio
            - button "Difícil" [ref=e73] [cursor=pointer]:
              - img [ref=e74]
              - text: Difícil
        - generic [ref=e76]:
          - generic [ref=e77]:
            - generic [ref=e78]: Ingredientes
            - generic [ref=e79]: Liste tudo que vai usar
          - generic [ref=e80]:
            - generic [ref=e81]:
              - generic [ref=e82]: "1"
              - 'textbox "Ex.: 200g de farinha" [ref=e83]': 2 cenouras
              - button [ref=e84] [cursor=pointer]:
                - img [ref=e85]
            - generic [ref=e87]:
              - generic [ref=e88]: "2"
              - textbox "Próximo ingrediente" [ref=e89]
              - button [ref=e90] [cursor=pointer]:
                - img [ref=e91]
            - button "Adicionar ingrediente" [ref=e93] [cursor=pointer]:
              - img [ref=e94]
              - text: Adicionar ingrediente
        - generic [ref=e96]:
          - generic [ref=e97]:
            - generic [ref=e98]: Modo de preparo
            - generic [ref=e99]: Passo a passo, na ordem
          - generic [ref=e100]:
            - generic [ref=e101]:
              - generic [ref=e102]: "01"
              - textbox "Descreva este passo…" [active] [ref=e103]: Bata no liquidificador
            - generic [ref=e104]:
              - generic [ref=e105]: "02"
              - textbox "Próximo passo" [ref=e106]
            - button "Adicionar passo" [ref=e107] [cursor=pointer]:
              - img [ref=e108]
              - text: Adicionar passo
        - generic [ref=e110]:
          - generic [ref=e111]:
            - generic [ref=e112]: Notas pessoais
            - generic [ref=e113]: Variações, lembretes, fontes…
          - 'textbox "Ex.: receita da minha avó, fica melhor com farinha 00…" [ref=e115]'
      - button "Salvar receita" [ref=e118] [cursor=pointer]:
        - img [ref=e119]
        - text: Salvar receita
    - navigation "navegação principal" [ref=e121]:
      - button "Home" [ref=e122] [cursor=pointer]:
        - img [ref=e123]
        - generic [ref=e125]: Home
      - button "Receitas" [ref=e126] [cursor=pointer]:
        - img [ref=e127]
        - generic [ref=e131]: Receitas
      - button "Adicionar receita" [ref=e133] [cursor=pointer]:
        - img [ref=e134]
      - button "Perfil" [ref=e136] [cursor=pointer]:
        - img [ref=e137]
        - generic [ref=e140]: Perfil
      - button "Config." [ref=e141] [cursor=pointer]:
        - img [ref=e142]
        - generic [ref=e145]: Config.
  - alert [ref=e146]
```

# Test source

```ts
  105 |     test('each field shows sequential amber number badge', async ({ page }) => {
  106 |       const badges = page.getByTestId('ingredient-number');
  107 |       await expect(badges.first()).toHaveText('1');
  108 |       await expect(badges.nth(1)).toHaveText('2');
  109 |     });
  110 | 
  111 |     test('"Adicionar ingrediente" button adds a new field', async ({ page }) => {
  112 |       await page.getByRole('button', { name: /adicionar ingrediente/i }).click();
  113 |       await expect(page.getByTestId('ingredient-input')).toHaveCount(3);
  114 |     });
  115 | 
  116 |     test('remove button is visible on each field when there are 2+', async ({ page }) => {
  117 |       const removeButtons = page.getByTestId('ingredient-remove');
  118 |       await expect(removeButtons).toHaveCount(2);
  119 |     });
  120 | 
  121 |     test('remove button is not shown when only 1 ingredient remains', async ({ page }) => {
  122 |       await page.getByTestId('ingredient-remove').first().click();
  123 |       await expect(page.getByTestId('ingredient-remove')).toHaveCount(0);
  124 |     });
  125 | 
  126 |     test('removing an ingredient decrements the list', async ({ page }) => {
  127 |       await page.getByRole('button', { name: /adicionar ingrediente/i }).click();
  128 |       await expect(page.getByTestId('ingredient-input')).toHaveCount(3);
  129 |       await page.getByTestId('ingredient-remove').first().click();
  130 |       await expect(page.getByTestId('ingredient-input')).toHaveCount(2);
  131 |     });
  132 |   });
  133 | 
  134 |   // US-03.4 — Passos dinâmicos
  135 |   test.describe('dynamic steps', () => {
  136 |     test('starts with 2 step fields', async ({ page }) => {
  137 |       await expect(page.getByTestId('step-textarea')).toHaveCount(2);
  138 |     });
  139 | 
  140 |     test('first step placeholder is "Descreva este passo…"', async ({ page }) => {
  141 |       await expect(page.getByTestId('step-textarea').first()).toHaveAttribute(
  142 |         'placeholder',
  143 |         'Descreva este passo…',
  144 |       );
  145 |     });
  146 | 
  147 |     test('step number is shown in italic display font with amber style', async ({ page }) => {
  148 |       const num = page.getByTestId('step-number').first();
  149 |       await expect(num).toHaveText('01');
  150 |       await expect(num).toHaveCSS('font-style', 'italic');
  151 |     });
  152 | 
  153 |     test('"Adicionar passo" button appends a new step', async ({ page }) => {
  154 |       await page.getByRole('button', { name: /adicionar passo/i }).click();
  155 |       await expect(page.getByTestId('step-textarea')).toHaveCount(3);
  156 |     });
  157 |   });
  158 | 
  159 |   // US-03.5 — Notas pessoais
  160 |   test.describe('personal notes', () => {
  161 |     test('notes textarea is visible with correct placeholder', async ({ page }) => {
  162 |       const notes = page.getByTestId('input-notes');
  163 |       await expect(notes).toBeVisible();
  164 |       await expect(notes).toHaveAttribute(
  165 |         'placeholder',
  166 |         'Ex.: receita da minha avó, fica melhor com farinha 00…',
  167 |       );
  168 |     });
  169 |   });
  170 | 
  171 |   // US-03.6 — Salvar receita
  172 |   test.describe('save recipe', () => {
  173 |     test('"Salvar receita" CTA is fixed at the bottom with amber background', async ({ page }) => {
  174 |       const cta = page.getByRole('button', { name: /salvar receita/i });
  175 |       await expect(cta).toBeVisible();
  176 |       await expect(cta).toHaveCSS('background-color', 'rgb(232, 160, 32)');
  177 |     });
  178 | 
  179 |     test('saving without name shows inline validation error', async ({ page }) => {
  180 |       await page.getByTestId('ingredient-input').first().fill('100g de farinha');
  181 |       await page.getByTestId('step-textarea').first().fill('Misture tudo');
  182 |       await page.getByRole('button', { name: /salvar receita/i }).click();
  183 |       await expect(page.getByTestId('error-recipe-name')).toBeVisible();
  184 |     });
  185 | 
  186 |     test('saving without any ingredient shows inline validation error', async ({ page }) => {
  187 |       await page.getByTestId('input-recipe-name').fill('Bolo de cenoura');
  188 |       await page.getByTestId('step-textarea').first().fill('Misture tudo');
  189 |       await page.getByRole('button', { name: /salvar receita/i }).click();
  190 |       await expect(page.getByTestId('error-ingredients')).toBeVisible();
  191 |     });
  192 | 
  193 |     test('saving without any step shows inline validation error', async ({ page }) => {
  194 |       await page.getByTestId('input-recipe-name').fill('Bolo de cenoura');
  195 |       await page.getByTestId('ingredient-input').first().fill('100g de farinha');
  196 |       await page.getByRole('button', { name: /salvar receita/i }).click();
  197 |       await expect(page.getByTestId('error-steps')).toBeVisible();
  198 |     });
  199 | 
  200 |     test('user adds recipe and sees it in Home feed', async ({ page }) => {
  201 |       await page.getByTestId('input-recipe-name').fill('Bolo de cenoura teste');
  202 |       await page.getByTestId('ingredient-input').first().fill('2 cenouras');
  203 |       await page.getByTestId('step-textarea').first().fill('Bata no liquidificador');
  204 | 
> 205 |       await page.getByRole('button', { name: /salvar receita/i }).click();
      |                                                                   ^ Error: locator.click: Test timeout of 30000ms exceeded.
  206 | 
  207 |       // Should redirect to the newly created recipe's detail
  208 |       await expect(page.getByTestId('detail-screen')).toBeVisible();
  209 |       await expect(page.getByTestId('detail-title')).toHaveText('Bolo de cenoura teste');
  210 |     });
  211 |   });
  212 | 
  213 |   // US-03.7 — Rascunho
  214 |   test.describe('draft', () => {
  215 |     test('"Rascunho" button is visible in the top bar', async ({ page }) => {
  216 |       await expect(page.getByRole('button', { name: /rascunho/i })).toBeVisible();
  217 |     });
  218 | 
  219 |     test('tapping "Rascunho" saves without validating required fields', async ({ page }) => {
  220 |       // no fields filled
  221 |       await page.getByRole('button', { name: /rascunho/i }).click();
  222 |       await expect(page.getByTestId('error-recipe-name')).not.toBeVisible();
  223 |     });
  224 | 
  225 |     test('tapping back with unsaved content shows discard dialog', async ({ page }) => {
  226 |       await page.getByTestId('input-recipe-name').fill('Receita incompleta');
  227 |       await page.getByTestId('btn-back').click();
  228 |       await expect(page.getByRole('dialog')).toBeVisible();
  229 |       await expect(page.getByRole('dialog')).toContainText('Deseja salvar como rascunho');
  230 |     });
  231 | 
  232 |     test('switching bottom nav tab with unsaved content shows discard dialog', async ({ page }) => {
  233 |       await page.getByTestId('input-recipe-name').fill('Receita incompleta');
  234 |       // Tap Home tab in bottom nav while form is dirty
  235 |       await page.getByRole('link', { name: /^home$/i }).click();
  236 |       await expect(page.getByRole('dialog')).toBeVisible();
  237 |       await expect(page.getByRole('dialog')).toContainText('Deseja salvar como rascunho');
  238 |     });
  239 | 
  240 |     test('navigating away with no content does not show discard dialog', async ({ page }) => {
  241 |       // Form untouched — no dialog expected
  242 |       await page.getByRole('link', { name: /^home$/i }).click();
  243 |       await expect(page.getByRole('dialog')).not.toBeVisible();
  244 |       await expect(page).toHaveURL('/');
  245 |     });
  246 |   });
  247 | });
  248 | 
```