# Saveur — Bug Log

**Mantido por:** qa-tester  
**Formato:** severidade / ID / tela ou componente / descrição / passos para reproduzir / status

| Severidade | ID | Área | Título | Status |
|------------|----|------|--------|--------|
| **Médio** | BUG-001 | Adicionar | Category chips no AddScreen sem `data-testid` | Corrigido |
| **Baixo** | BUG-002 | Adicionar | `stepper-time-value` inclui label "min" no textContent | Corrigido |
| **Alto** | BUG-003 | Infra/E2E | Chrome worker crash `0xC0000142` cascata 120 falhas | Aberto |
| **Crítico** | BUG-004 | Infra/E2E | Suíte E2E não roda: projeto Supabase inacessível (`ENOTFOUND`) | Aberto |
| **Alto** | BUG-005 | Infra/E2E | Specs escritas contra rotas e seletores que não existem mais | Corrigido |

---

## Severidades

| Nível | Critério |
|-------|----------|
| **Crítico** | Bloqueia fluxo principal; dado perdido; crash; falha de segurança |
| **Alto** | Funcionalidade importante quebrada; divergência grave de design (CTA com cor errada, fonte errada em título) |
| **Médio** | Funcionalidade parcialmente quebrada; divergência visual notável (espaçamento, tamanho incorreto) |
| **Baixo** | Comportamento inconsistente menor; divergência visual sutil |

---

## Template de bug

```
### BUG-XXX — [Título curto]

**Severidade:** Crítico / Alto / Médio / Baixo  
**Área:** Home / Detalhes / Adicionar / Perfil / API / Visual  
**Reportado em:** YYYY-MM-DD  
**Status:** Aberto / Em investigação / Corrigido / Fechado  
**Responsável:** (dev ou componente)

**Descrição:**  
Breve descrição do comportamento incorreto.

**Passos para reproduzir:**  
1. ...
2. ...
3. ...

**Resultado esperado:**  
O que deveria acontecer.

**Resultado atual:**  
O que acontece de fato.

**Referência:**  
User story ou critério de aceitação violado (ex: US-02.5 — Favoritar receita).  
Token de design violado, se aplicável (ex: `amber #E8A020`).
```

---

---

### BUG-001 — Category chips no AddScreen sem `data-testid`

**Severidade:** Médio  
**Área:** Adicionar (`/adicionar`)  
**Reportado em:** 2026-05-24  
**Status:** Corrigido — commit `fix: add data-testid to category chips and isolate stepper value from unit text`  
**Responsável:** frontend-dev

**Descrição:**  
Os chips de categoria na tela Adicionar (`apps/web/src/app/(shell)/adicionar/page.tsx:150–163`) não possuem atributo `data-testid`. O spec `add-recipe.spec.ts` testa `category-chip-sobremesa`, `category-chip-jantar`, etc., mas esses elementos não são selecionáveis por testid.

**Passos para reproduzir:**  
1. Abrir `/adicionar`
2. Inspecionar chips de categoria — nenhum tem `data-testid`

**Resultado esperado:**  
Chips com `data-testid="category-chip-{slug}"` e `data-active="true/false"`, com slug NFD-normalizado (ex: `category-chip-cafe-da-manha`), igual ao padrão da HomeScreen.

**Resultado atual:**  
`<button>Sobremesa</button>` — sem testid. `getByTestId('category-chip-sobremesa')` não encontra elemento (timeout 30s).

**Referência:** US-03.1 — Seleção de categoria.

---

### BUG-002 — `stepper-time-value` inclui label "min" no textContent

**Severidade:** Baixo  
**Área:** Adicionar (`/adicionar`)  
**Reportado em:** 2026-05-24  
**Status:** Corrigido — commit `fix: add data-testid to category chips and isolate stepper value from unit text`  
**Responsável:** frontend-dev

**Descrição:**  
O `Stepper` componente renderiza valor e unidade dentro do mesmo elemento `data-testid="stepper-time-value"`: `{value}{unit && <span>min</span>}`. O textContent resultante é `"30min"` em vez de `"30"`.

**Passos para reproduzir:**  
1. Abrir `/adicionar`
2. Inspecionar `[data-testid="stepper-time-value"]`
3. `textContent` = `"30min"`

**Resultado esperado:**  
`textContent` = `"30"` (apenas o número). A unidade deveria estar fora do elemento testid, ou o testid deveria cobrir só o número.

**Resultado atual:**  
`textContent` = `"30min"` (unidade concatenada). `toHaveText('30')` falha.

**Referência:** US-03.1 — Stepper de tempo. `apps/web/src/app/(shell)/adicionar/page.tsx:461–462`.

---

### BUG-003 — Chrome worker crash `0xC0000142` cascata

**Severidade:** Alto  
**Área:** Infra / E2E  
**Reportado em:** 2026-05-24  
**Status:** Aberto  
**Responsável:** qa-tester / architect

**Descrição:**  
Ao rodar os testes Playwright com `workers: undefined` (paralelismo padrão = 6 workers no Windows), o Chromium headless shell crasha com código de saída `0xC0000142` (STATUS_DLL_INIT_FAILED) após ~17 testes. Todos os workers subsequentes morrem em cascata resultando em 120 falhas de infra, não de app.

**Causa provável:**  
`--enable-unsafe-swiftshader` + paralelismo alto no Windows causam falha na inicialização do renderer GPU.

**Workaround:**  
Rodar com `--workers=1` ou configurar `workers: 1` no `playwright.config.ts` para Windows.

**Impacto:**  
120 testes marcados como "failed" sem execução real. Apenas 4 falhas reais antes do crash (BUG-001, BUG-002).

---

### BUG-004 — Suíte E2E não roda: projeto Supabase inacessível

**Severidade:** Crítico
**Área:** Infra / E2E
**Reportado em:** 2026-09-04
**Status:** Aberto
**Responsável:** architect

**Descrição:**
O host em `NEXT_PUBLIC_SUPABASE_URL` não resolve. Toda leitura de dado falha antes de sair da máquina, então nem a suíte E2E nem a verificação manual dos fluxos de conta (sair, alterar senha, excluir conta) podem rodar.

**Passos para reproduzir:**
1. `cd apps/web && pnpm dev`
2. Abrir `/`

**Resultado esperado:**
Feed de receitas.

**Resultado atual:**
`GET / 500`. No log do servidor:

```
{"level":"error","operation":"fetchRecipes","code":"","message":"TypeError: fetch failed"}
⨯ Caused by: Error: getaddrinfo ENOTFOUND <projeto>.supabase.co (ENOTFOUND)
```

O app degrada como deveria — a tela de erro aparece no lugar da tela branca (`error.tsx`), e o logger registra a operação. O bloqueio é de infraestrutura, não de código.

**Impacto:**
Bloqueia: aplicar `supabase/migrations/20260904000001_account_security.sql`; rodar `pnpm test:e2e` (o `auth.setup.ts` precisa autenticar contra o projeto); e verificar manualmente logout, redefinição de senha e exclusão de conta.

**Destravar:**
Religar ou recriar o projeto Supabase, aplicar as três migrations em ordem, criar a conta de teste em `/auth/cadastro`, rodar `supabase/seed.sql` para ela e exportar `E2E_EMAIL` / `E2E_PASSWORD`.

---

### BUG-005 — Specs escritas contra rotas e seletores que não existem mais

**Severidade:** Alto
**Área:** Infra / E2E
**Reportado em:** 2026-09-04
**Status:** Corrigido — commit `fix: give the e2e suite an auth fixture and current selectors`
**Responsável:** qa-tester

**Descrição:**
O último relatório verde (`test-results/.last-run.json`) é de 2026-05-24, anterior ao middleware de auth e à migração para Supabase. A suíte passou a afirmar coisas que deixaram de ser verdade:

1. `navigation.spec.ts` esperava `/add` e `/profile` — rotas que nunca existiram no app em português.
2. As abas do bottom nav são `<button>` com `router.push`, não `<a>`; `getByRole('link')` não casava com nenhuma.
3. Os botões de bookmark e o sino de notificações não tinham nome acessível, então `getByRole('button', { name: /salvar/i })` e `/notificações/i` não achavam nada.
4. Sem `storageState`, o middleware mandava `/adicionar` e `/perfil` para o login e as specs dessas telas expiravam procurando um testid que nunca aparecia.

**Correção:**
Projeto `setup` no `playwright.config.ts` grava a sessão em `e2e/.auth/user.json`; rotas e seletores atualizados; `aria-label` + `data-saved` nos bookmarks e `aria-label` no sino.

**Pendente:**
A execução verde depende do BUG-004. As asserções de pixel e cor exata (`toHaveCSS('height', '380px')`, `rgb(232, 160, 32)`) seguem como estavam e ainda não foram revalidadas contra dados reais do banco.

---

*Última atualização: 2026-09-04*
