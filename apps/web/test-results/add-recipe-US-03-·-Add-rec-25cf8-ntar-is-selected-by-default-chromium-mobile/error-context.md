# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: add-recipe.spec.ts >> US-03 · Add recipe >> basic fields >> category chips are shown and "Jantar" is selected by default
- Location: e2e\add-recipe.spec.ts:17:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('category-chip-café-da-manhã')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByTestId('category-chip-café-da-manhã')

```

```yaml
- button:
  - img
- text: Nova receita
- button "Rascunho"
- img
- text: Adicionar foto Mostre o prato finalizado Nome da receita
- 'textbox "Ex.: Pasta al limone"'
- text: Categoria
- button "Café da manhã"
- button "Almoço"
- button "Jantar"
- button "Sobremesa"
- button "Snacks"
- text: Detalhes
- img
- text: Tempo
- button:
  - img
- text: 30 min
- button:
  - img
- img
- text: Porções
- button:
  - img
- text: "4"
- button:
  - img
- button "Fácil":
  - img
  - text: Fácil
- button "Médio":
  - img
  - text: Médio
- button "Difícil":
  - img
  - text: Difícil
- text: Ingredientes Liste tudo que vai usar 1
- 'textbox "Ex.: 200g de farinha"'
- button:
  - img
- text: "2"
- textbox "Próximo ingrediente"
- button:
  - img
- button "Adicionar ingrediente":
  - img
  - text: Adicionar ingrediente
- text: Modo de preparo Passo a passo, na ordem 01
- textbox "Descreva este passo…"
- text: "02"
- textbox "Próximo passo"
- button "Adicionar passo":
  - img
  - text: Adicionar passo
- text: Notas pessoais Variações, lembretes, fontes…
- 'textbox "Ex.: receita da minha avó, fica melhor com farinha 00…"'
- button "Salvar receita":
  - img
  - text: Salvar receita
- navigation "navegação principal":
  - button "Home":
    - img
    - text: Home
  - button "Receitas":
    - img
    - text: Receitas
  - button "Adicionar receita":
    - img
  - button "Perfil":
    - img
    - text: Perfil
  - button "Config.":
    - img
    - text: Config.
- alert
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('US-03 · Add recipe', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/adicionar');
  6   |     await expect(page.getByTestId('add-screen')).toBeVisible();
  7   |   });
  8   | 
  9   |   // US-03.1 — Campos básicos
  10  |   test.describe('basic fields', () => {
  11  |     test('name field has correct placeholder and uses display font', async ({ page }) => {
  12  |       const nameInput = page.getByTestId('input-recipe-name');
  13  |       await expect(nameInput).toHaveAttribute('placeholder', 'Ex.: Pasta al limone');
  14  |       await expect(nameInput).toHaveCSS('font-family', /Instrument Serif/);
  15  |     });
  16  | 
  17  |     test('category chips are shown and "Jantar" is selected by default', async ({ page }) => {
  18  |       for (const cat of ['Café da manhã', 'Almoço', 'Jantar', 'Sobremesa', 'Snacks']) {
> 19  |         await expect(page.getByTestId(`category-chip-${cat.toLowerCase().replace(/\s/g, '-')}`)).toBeVisible();
      |                                                                                                  ^ Error: expect(locator).toBeVisible() failed
  20  |       }
  21  |       await expect(page.getByTestId('category-chip-jantar')).toHaveAttribute('data-active', 'true');
  22  |     });
  23  | 
  24  |     test('selecting a different category activates it with amber style', async ({ page }) => {
  25  |       const chip = page.getByTestId('category-chip-sobremesa');
  26  |       await chip.click();
  27  |       await expect(chip).toHaveAttribute('data-active', 'true');
  28  |       await expect(chip).toHaveCSS('background-color', 'rgb(232, 160, 32)');
  29  |     });
  30  | 
  31  |     test('time stepper starts at 30 min and increments by 5', async ({ page }) => {
  32  |       const value = page.getByTestId('stepper-time-value');
  33  |       await expect(value).toContainText('30');
  34  |       await page.getByTestId('stepper-time-plus').click();
  35  |       await expect(value).toContainText('35');
  36  |     });
  37  | 
  38  |     test('time stepper minimum is 5 min', async ({ page }) => {
  39  |       const minusBtn = page.getByTestId('stepper-time-minus');
  40  |       const value = page.getByTestId('stepper-time-value');
  41  |       for (let i = 0; i < 10; i++) await minusBtn.click();
  42  |       await expect(value).toContainText('5');
  43  |     });
  44  | 
  45  |     test('portions stepper starts at 4 and increments by 1', async ({ page }) => {
  46  |       const value = page.getByTestId('stepper-portions-value');
  47  |       await expect(value).toHaveText('4');
  48  |       await page.getByTestId('stepper-portions-plus').click();
  49  |       await expect(value).toHaveText('5');
  50  |     });
  51  | 
  52  |     test('portions stepper minimum is 1', async ({ page }) => {
  53  |       const minusBtn = page.getByTestId('stepper-portions-minus');
  54  |       const value = page.getByTestId('stepper-portions-value');
  55  |       for (let i = 0; i < 10; i++) await minusBtn.click();
  56  |       await expect(value).toHaveText('1');
  57  |     });
  58  | 
  59  |     test('"Médio" difficulty is active by default', async ({ page }) => {
  60  |       await expect(page.getByTestId('difficulty-medio')).toHaveAttribute('data-active', 'true');
  61  |     });
  62  | 
  63  |     test('selecting difficulty applies amber soft style', async ({ page }) => {
  64  |       const btn = page.getByTestId('difficulty-facil');
  65  |       await btn.click();
  66  |       await expect(btn).toHaveAttribute('data-active', 'true');
  67  |       await expect(btn).toHaveCSS('color', 'rgb(232, 160, 32)');
  68  |     });
  69  |   });
  70  | 
  71  |   // US-03.2 — Upload de foto
  72  |   test.describe('photo upload', () => {
  73  |     test('upload area is visible with camera icon and instructional text', async ({ page }) => {
  74  |       await expect(page.getByTestId('photo-upload-area')).toBeVisible();
  75  |       await expect(page.getByText('Adicionar foto')).toBeVisible();
  76  |       await expect(page.getByText('Mostre o prato finalizado')).toBeVisible();
  77  |     });
  78  | 
  79  |     test('upload area has dashed border style', async ({ page }) => {
  80  |       const area = page.getByTestId('photo-upload-area');
  81  |       await expect(area).toHaveCSS('border-style', 'dashed');
  82  |     });
  83  |   });
  84  | 
  85  |   // US-03.3 — Ingredientes dinâmicos
  86  |   test.describe('dynamic ingredients', () => {
  87  |     test('starts with 2 ingredient fields', async ({ page }) => {
  88  |       await expect(page.getByTestId('ingredient-input')).toHaveCount(2);
  89  |     });
  90  | 
  91  |     test('first field placeholder is "Ex.: 200g de farinha"', async ({ page }) => {
  92  |       await expect(page.getByTestId('ingredient-input').first()).toHaveAttribute(
  93  |         'placeholder',
  94  |         'Ex.: 200g de farinha',
  95  |       );
  96  |     });
  97  | 
  98  |     test('subsequent fields placeholder is "Próximo ingrediente"', async ({ page }) => {
  99  |       await expect(page.getByTestId('ingredient-input').nth(1)).toHaveAttribute(
  100 |         'placeholder',
  101 |         'Próximo ingrediente',
  102 |       );
  103 |     });
  104 | 
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
```