# Saveur — Entity Relationship Diagram

## Diagrama

```
auth.users (Supabase Auth)
    │ 1
    │
    ▼ 1
profiles ──────────────────────────────────────────────────┐
  id (PK, uuid)                                             │
  username (text)                                           │
  bio (text)                                                │
  avatar_url (text)                                         │
  is_premium (boolean)                                      │
  created_at (timestamptz)                                  │
    │ 1                                                     │
    │                                                       │
    ├─── N recipes ─────────────────────────────────────┐   │
    │       id (PK, uuid)                               │   │
    │       owner_id (FK → profiles.id)                 │   │
    │       name (text)                                 │   │
    │       category (text)                             │   │
    │       time_min (int)                              │   │
    │       difficulty (text)                           │   │
    │       portions (int)                              │   │
    │       calories (int)                              │   │
    │       img_url (text)                              │   │
    │       description (text)                          │   │
    │       notes (text)                                │   │
    │       is_public (boolean)                         │   │
    │       created_at (timestamptz)                    │   │
    │       updated_at (timestamptz)                    │   │
    │           │ 1                                     │   │
    │           ├─── N recipe_ingredients               │   │
    │           │       id (PK, uuid)                   │   │
    │           │       recipe_id (FK → recipes.id)     │   │
    │           │       position (int)                  │   │
    │           │       text (text)                     │   │
    │           │                                       │   │
    │           └─── N recipe_steps                     │   │
    │                   id (PK, uuid)                   │   │
    │                   recipe_id (FK → recipes.id)     │   │
    │                   position (int)                  │   │
    │                   title (text)                    │   │
    │                   body (text)                     │   │
    │                   tip (text, nullable)            │   │
    │                                                   │   │
    ├─── N collections                                  │   │
    │       id (PK, uuid)                               │   │
    │       owner_id (FK → profiles.id) ────────────────┘   │
    │       name (text)                                     │
    │       emoji (text)                                    │
    │           │ N                                         │
    │           └─── M collection_recipes ─── N recipes    │
    │                   collection_id (FK)                  │
    │                   recipe_id (FK)                      │
    │                   PK (collection_id, recipe_id)       │
    │                                                       │
    └─── N favorites                                        │
            user_id (FK → profiles.id) ────────────────────┘
            recipe_id (FK → recipes.id)
            PK (user_id, recipe_id)
```

## Notas

- `auth.users` é gerenciada pelo Supabase Auth — nunca manipulada diretamente
- `profiles` é criada via trigger `AFTER INSERT ON auth.users`
- RLS ativado em todas as tabelas de domínio
- Índices: `recipes.owner_id`, `recipes.category`, `favorites.user_id`, `collection_recipes.collection_id`
