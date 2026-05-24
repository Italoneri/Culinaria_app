# ADR-0008 — PWA Android: manifest, service worker, cache offline

**Status:** Aceito
**Data:** 2026-05-24

## Contexto

O app é instalável como PWA no Android via Chrome. Requisitos:
- `theme_color: #E8A020` (âmbar) na barra de status Android
- `display: standalone` — sem barra de URL do browser
- `orientation: portrait` — app fixo em retrato
- Funcionalidade offline básica: receitas já visitadas disponíveis sem internet
- Critério de installability do Chrome: HTTPS + manifest + service worker com `fetch` handler

## Decisão

### Web App Manifest

```json
// apps/web/public/manifest.json
{
  "name": "Saveur",
  "short_name": "Saveur",
  "description": "Suas receitas, organizadas com elegância",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#0D0D0D",
  "theme_color": "#E8A020",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

### Meta tags no root layout

```html
<meta name="theme-color" content="#E8A020" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<link rel="manifest" href="/manifest.json" />
```

### Service Worker

Registrado via `next-pwa` (wrapper sobre Workbox) ou implementação manual em `apps/web/public/sw.js`.

**Estratégias de cache:**

| Recurso | Estratégia | TTL |
|---------|-----------|-----|
| Pages (HTML) | Network-first → Cache fallback | 7 dias |
| Assets estáticos (JS/CSS/fonts) | Cache-first | 30 dias |
| Imagens de receitas (CDN Supabase) | Stale-while-revalidate | 7 dias |
| API responses (receitas) | Network-first → Cache fallback | 1 hora |

**Offline fallback:** página `/offline` servida quando network falha e page não está em cache.

### Viewport

```css
/* globals.css */
html, body {
  overscroll-behavior: none;    /* evita bounce scroll nativo do Android */
  -webkit-tap-highlight-color: transparent;
}
```

`viewport-fit=cover` garante que o conteúdo preenche a tela inteira em telas com notch/punch-hole (Pixel, Samsung Galaxy).

## Alternativas consideradas

| Opção | Por que rejeitada |
|-------|------------------|
| `next-pwa` (biblioteca) | Abstração útil, mas Workbox direto dá mais controle sobre estratégias de cache |
| Capacitor (hybrid app) | Transforma PWA em app nativo; fora do escopo — target é PWA puro |
| Workbox via webpack plugin | `next-pwa` simplifica a integração com Next.js sem perder controle |

## Consequências

- HTTPS obrigatório em produção (Vercel/Railway proveem automaticamente)
- Ícones `icon-192.png` e `icon-512.png` necessários em `public/icons/` — criar com acento âmbar no ícone
- `beforeinstallprompt` capturado para mostrar banner de instalação customizado (UX premium)
- Testes Playwright incluem verificação de `manifest.json` acessível e service worker registrado
