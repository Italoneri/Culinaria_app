# Saveur — Architecture

## Visão geral

App mobile de receitas culinárias. Web mobile-first instalável como PWA no Android via Chrome. 4 telas: Home (feed), Detalhes, Adicionar, Perfil.

## Stack

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Frontend | Next.js 14 (App Router) | Compatível com os JSX do design handoff; RSC para páginas estáticas, Client Components para interatividade |
| Estilização | CSS Modules + CSS custom properties | Tokens de design em variáveis CSS; sem overhead de runtime |
| Backend | Next.js Server Actions | Mutações validadas com zod no servidor; sem serviço nem runtime extra (ver ADR-0009) |
| Banco | PostgreSQL via Supabase | Auth embutido, Storage para imagens, SDK TypeScript |
| Autenticação | Supabase Auth (magic link + Google) | Zero-config, JWT gerenciado, compatível com RLS |
| Upload de imagens | Supabase Storage | Co-locado com o banco; CDN automático |
| Testes | Vitest (unit) + Playwright (E2E) | Padrão da indústria; Playwright cobre PWA/Android Chrome |
| Monorepo | Turborepo + pnpm workspaces | Build incremental; compartilhamento de types entre apps |

## Estrutura de pastas

```
Culinaria_app/
├── apps/
│   ├── web/                        # Next.js 14 App Router
│   │   ├── app/
│   │   │   ├── (shell)/            # Layout com BottomNav
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx        # Home
│   │   │   │   ├── receita/[id]/
│   │   │   │   │   └── page.tsx    # Detalhes
│   │   │   │   ├── adicionar/
│   │   │   │   │   └── page.tsx    # Adicionar receita
│   │   │   │   └── perfil/
│   │   │   │       └── page.tsx    # Perfil
│   │   │   ├── api/                # Route handlers Next.js (proxies leves)
│   │   │   ├── globals.css         # Design tokens como CSS custom properties
│   │   │   └── layout.tsx          # Root layout + PWA meta tags
│   │   ├── components/
│   │   │   ├── ui/                 # Primitivos: Icon, Pill, BottomNav, RecipeCard
│   │   │   └── screens/            # Componentes de tela (migrados do handoff)
│   │   ├── lib/
│   │   │   ├── supabase.ts         # Client de browser + upload para o Storage
│   │   │   ├── supabase-server.ts  # Client de sessão (cookies) para RSC e actions
│   │   │   ├── db.ts               # Leituras — únicas chamadas de dados nos RSC
│   │   │   ├── actions.ts          # Server Actions: criar receita, favoritar, perfil
│   │   │   └── data.ts             # Tipos e constantes de domínio
│   │   ├── public/
│   │   │   ├── manifest.json       # PWA manifest
│   │   │   ├── icons/              # Ícones adaptativos Android + apple-touch
│   │   │   └── sw.js               # Service worker
│   │   └── next.config.mjs
├── supabase/
│   ├── migrations/                 # Schema, RLS e bucket do Storage
│   └── seed.sql                    # 6 receitas do handoff para o usuário de dev
├── docs/
│   ├── adr/                        # Architectural Decision Records
│   ├── design/
│   │   └── saveur-handoff/         # Arquivos JSX do design (referência)
│   └── erd.md
├── turbo.json
├── pnpm-workspace.yaml
└── ARCHITECTURE.md
```

## Shape dos dados (derivado do design handoff)

```typescript
type Difficulty = 'Fácil' | 'Médio' | 'Difícil';
type Category = 'Café da manhã' | 'Almoço' | 'Jantar' | 'Sobremesa' | 'Snacks';

interface RecipeStep {
  t: string;      // título do passo
  d: string;      // descrição
  tip?: string;   // dica do chef (opcional)
}

interface Recipe {
  id: string;
  name: string;
  category: Category;
  time: number;           // minutos
  difficulty: Difficulty;
  portions: number;
  calories: number;
  img: string;            // URL da imagem
  desc: string;
  ingredients: string[];
  steps: RecipeStep[];
  notes?: string;         // notas pessoais do usuário
}

interface Collection {
  id: string;
  userId: string;
  name: string;
  emoji: string;
  recipeIds: string[];
}
```

## Design tokens

Definidos em `apps/web/app/globals.css` como CSS custom properties:

```css
:root {
  --bg: #0D0D0D;
  --card: #1A1A1A;
  --card-elev: #222222;
  --border: rgba(255,255,255,0.06);
  --border-strong: rgba(255,255,255,0.1);
  --amber: #E8A020;
  --amber-soft: rgba(232,160,32,0.14);
  --amber-mid: rgba(232,160,32,0.22);
  --text: #F5F2EC;
  --text-muted: rgba(245,242,236,0.62);
  --text-dim: rgba(245,242,236,0.38);
  --good: #7BB069;
  --font-display: "Instrument Serif", Georgia, serif;
  --font-sans: "Manrope", -apple-system, system-ui, sans-serif;
}
```

## PWA (Android Chrome)

- `manifest.json`: `theme_color: #E8A020`, `display: standalone`, `orientation: portrait`
- Viewport alvo: 360–412px (Galaxy S a Pixel)
- Service worker com cache offline para páginas e assets estáticos
- Estratégia de cache: Network-first para receitas, Cache-first para assets

## ADRs

- [ADR-0001](docs/adr/ADR-0001-stack-frontend.md) — Stack frontend: Next.js 14 App Router
- [ADR-0002](docs/adr/ADR-0002-stack-backend.md) — Stack backend: Hono + Bun *(substituído pelo ADR-0009)*
- [ADR-0003](docs/adr/ADR-0003-autenticacao.md) — Autenticação: Supabase Auth
- [ADR-0004](docs/adr/ADR-0004-persistencia.md) — Persistência: PostgreSQL via Supabase
- [ADR-0005](docs/adr/ADR-0005-upload-imagens.md) — Upload de imagens: Supabase Storage
- [ADR-0006](docs/adr/ADR-0006-monorepo.md) — Estrutura monorepo: Turborepo + pnpm
- [ADR-0007](docs/adr/ADR-0007-testes.md) — Estratégia de testes: Vitest + Playwright
- [ADR-0008](docs/adr/ADR-0008-pwa-android.md) — PWA Android: manifest, service worker, cache offline
- [ADR-0009](docs/adr/ADR-0009-remocao-api-hono.md) — Remoção da API Hono: acesso direto ao Supabase (substitui ADR-0002)
