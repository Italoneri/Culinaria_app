# ADR-0007 — Estratégia de testes: Vitest + Playwright

**Status:** Aceito
**Data:** 2026-05-24

## Contexto

O app tem lógica de negócio (filtros de receita, validação de formulário, cálculos de porções) e 4 telas com interações críticas (navegação, checklist de ingredientes, submit de nova receita). A estratégia deve cobrir ambos sem overhead de manutenção.

## Decisão

**Vitest para unit/integration, Playwright para E2E.**

### Vitest (unit/integration)

- Funções puras de lógica de negócio (filtros, validação, formatação)
- Hooks e utilities da aplicação
- Testes co-locados: `foo.test.ts` ao lado de `foo.ts`
- Sem mocks de componentes UI — esses são cobertos pelo Playwright

### Playwright (E2E)

- Jornadas completas das 4 telas
- Target: Chromium em viewport `390x844` (emula Android Chrome)
- PWA: testa installability, offline mode via service worker
- Localizado em `apps/web/e2e/`

```typescript
// playwright.config.ts
use: {
  viewport: { width: 390, height: 844 },
  userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) ...',
}
```

### Convenções de nomenclatura

- Unit: verbo 3ª pessoa — `filtersRecipesByCategory`, `rejectsEmptyRecipeName`
- E2E: fluxo descritivo — `user adds recipe and sees it in home feed`
- Sem "should" em nenhum nome de teste

### Cobertura mínima esperada

| Área | Tipo | Threshold |
|------|------|-----------|
| Lógica de filtro/busca | Unit | 100% |
| Validação de formulário Add | Unit | 100% |
| Jornada Home → Detalhe | E2E | obrigatório |
| Jornada Add Recipe | E2E | obrigatório |
| Jornada Perfil → Coleções | E2E | obrigatório |

## Alternativas consideradas

| Opção | Por que rejeitada |
|-------|------------------|
| Jest | Mais lento que Vitest; sem vantagens no ecossistema Next.js atual |
| Cypress | Playwright é mais rápido, tem melhor suporte a mobile viewport e PWA |
| Testing Library | Boa para unit de componentes, mas adiciona uma camada; Playwright cobre o mesmo em E2E |
| Storybook + Chromatic | Visual regression útil, mas fora do escopo inicial |

## Consequências

- `vitest.config.ts` na raiz com `projects` apontando para `apps/web` e `apps/api`
- CI executa unit tests em paralelo com E2E headless
- Playwright screenshots salvas como artefatos no CI em caso de falha
