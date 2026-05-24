# ADR-0004 — Persistência: PostgreSQL via Supabase

**Status:** Aceito
**Data:** 2026-05-24

## Contexto

Os dados do app (derivados de `data.js` do handoff) são relacionais por natureza: receitas têm passos, ingredientes, categorias; usuários têm coleções de receitas. Um banco relacional é a escolha natural.

## Decisão

**PostgreSQL hospedado no Supabase.**

Supabase oferece PostgreSQL gerenciado com PostgREST (API REST automática), RLS para segurança por linha, Realtime para atualizações ao vivo (caso futuro), e Storage co-locado.

## Schema ERD resumido

```sql
-- Usuários gerenciados pelo Supabase Auth (tabela auth.users)

CREATE TABLE profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id),
  username   text,
  bio        text,
  avatar_url text,
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE recipes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name        text NOT NULL,
  category    text NOT NULL,  -- 'Café da manhã' | 'Almoço' | 'Jantar' | 'Sobremesa' | 'Snacks'
  time_min    int NOT NULL,
  difficulty  text NOT NULL,  -- 'Fácil' | 'Médio' | 'Difícil'
  portions    int NOT NULL,
  calories    int,
  img_url     text,
  description text,
  notes       text,
  is_public   boolean DEFAULT false,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE TABLE recipe_ingredients (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  position  int NOT NULL,
  text      text NOT NULL
);

CREATE TABLE recipe_steps (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  position  int NOT NULL,
  title     text NOT NULL,
  body      text NOT NULL,
  tip       text
);

CREATE TABLE collections (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name     text NOT NULL,
  emoji    text DEFAULT '📚'
);

CREATE TABLE collection_recipes (
  collection_id uuid REFERENCES collections(id) ON DELETE CASCADE,
  recipe_id     uuid REFERENCES recipes(id) ON DELETE CASCADE,
  PRIMARY KEY (collection_id, recipe_id)
);

CREATE TABLE favorites (
  user_id   uuid REFERENCES profiles(id) ON DELETE CASCADE,
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, recipe_id)
);
```

## RLS policies

Toda tabela tem RLS ativado. Padrão:
- `SELECT`: públicas se `is_public = true`, privadas se `owner_id = auth.uid()`
- `INSERT/UPDATE/DELETE`: apenas `owner_id = auth.uid()`

## Alternativas consideradas

| Opção | Por que rejeitada |
|-------|------------------|
| Firebase Firestore | NoSQL; queries relacionais são mais complexas; custo por leitura |
| PlanetScale (MySQL) | Sem RLS nativo; requer lógica extra de autorização |
| SQLite (Turso) | Edge-friendly, mas co-location com Supabase Auth perdida |
| MongoDB Atlas | Documento não é natural para dados relacionais de receitas |

## Consequências

- SDK `@supabase/supabase-js` acessa PostgreSQL via PostgREST — sem SQL raw no frontend
- Migrações gerenciadas com `supabase migrations` (CLI do Supabase)
- Seed de desenvolvimento com os dados de `data.js` do handoff
