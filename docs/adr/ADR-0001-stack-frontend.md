# ADR-0001 — Stack frontend: Next.js 14 App Router

**Status:** Aceito
**Data:** 2026-05-24

## Contexto

O design handoff entregou 4 telas em JSX puro (React sem framework). O app é web mobile-first, target Android via Chrome, instalável como PWA. Precisamos de uma stack que:

1. Aceite os JSX existentes com refatoração mínima (sem reescrita total)
2. Suporte PWA nativo (manifest, service worker, meta tags)
3. Gere páginas performáticas para mobile (LCP < 2.5s em 4G)
4. Tenha suporte TypeScript first-class

## Decisão

**Next.js 14 com App Router.**

Os componentes JSX do handoff (`HomeScreen`, `DetailScreen`, `AddScreen`, `ProfileScreen`) são React puro — migram diretamente para Server Components (partes estáticas) e Client Components (estado: `useState`, handlers). Nenhuma reescrita de lógica de UI é necessária.

## Alternativas consideradas

| Opção | Por que rejeitada |
|-------|------------------|
| Vite + React SPA | Sem SSR/RSC; SEO e LCP ruins; PWA precisa de config manual extra |
| Remix | App Router do Next.js tem paridade de features com melhor ecossistema |
| React Native + Expo | O target é Android Chrome via PWA, não app nativo da store |
| Astro | Excelente para conteúdo estático, mas interatividade pesada (forms, estado) adiciona fricção |

## Consequências

- `'use client'` necessário nos componentes com `useState` (AddScreen, DetailScreen checklist)
- Fontes carregadas via `next/font` (Manrope + Instrument Serif) — zero CLS
- Imagens via `next/image` — otimização automática, lazy loading, AVIF/WebP
- Route groups `(shell)` para layout compartilhado com BottomNav sem duplicação
