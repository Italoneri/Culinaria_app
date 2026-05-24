# ADR-0006 — Estrutura monorepo: Turborepo + pnpm workspaces

**Status:** Aceito
**Data:** 2026-05-24

## Contexto

O projeto tem dois apps (`apps/web` e `apps/api`) que precisam compartilhar tipos TypeScript. Um monorepo evita duplicação de interfaces e garante que o contrato da API seja o mesmo nos dois lados.

## Decisão

**Turborepo com pnpm workspaces.**

```
pnpm-workspace.yaml:
  packages:
    - 'apps/*'
    - 'packages/*'
```

`packages/types` exporta os tipos compartilhados (`Recipe`, `RecipeStep`, `Collection`, etc.) gerados a partir do schema do banco via `supabase gen types typescript`.

## Estrutura de scripts

```json
// turbo.json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "test": { "dependsOn": ["^build"] },
    "lint": {}
  }
}
```

## Alternativas consideradas

| Opção | Por que rejeitada |
|-------|------------------|
| Nx | Mais poderoso, mas complexidade desnecessária para 2 apps |
| Lerna | Legado; Turborepo é o sucessor espiritual com melhor DX |
| Repos separados | Tipos duplicados; sincronização manual; deploy mais complexo |
| npm workspaces | pnpm é mais eficiente em espaço em disco e resolução de deps |

## Consequências

- `pnpm install` na raiz instala deps de todos os apps
- `turbo dev` inicia `apps/web` e `apps/api` em paralelo com logs coloridos
- `packages/types` publica tipos gerados — nunca tipos escritos à mão para o schema do banco
- CI roda `turbo test lint build` — cache de artefatos entre PRs economiza ~60% do tempo de build
