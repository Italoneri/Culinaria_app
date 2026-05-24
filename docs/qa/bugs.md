# Saveur — Bug Log

**Mantido por:** qa-tester  
**Formato:** severidade / ID / tela ou componente / descrição / passos para reproduzir / status

| Severidade | ID | Área | Título | Status |
|------------|----|------|--------|--------|
| **Médio** | BUG-001 | Adicionar | Category chips no AddScreen sem `data-testid` | Corrigido |
| **Baixo** | BUG-002 | Adicionar | `stepper-time-value` inclui label "min" no textContent | Corrigido |
| **Alto** | BUG-003 | Infra/E2E | Chrome worker crash `0xC0000142` cascata 120 falhas | Aberto |

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

*Última atualização: 2026-05-24*
