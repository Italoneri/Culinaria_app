# Saveur API Contract

**Base URL:** `http://localhost:3001/api` (dev) · `https://api.saveur.app/api` (prod)

**Auth:** todas as rotas exigem `Authorization: Bearer <supabase_jwt>` no header.

---

## Tipos compartilhados

```typescript
type Difficulty = 'Fácil' | 'Médio' | 'Difícil'
type Category   = 'Café da manhã' | 'Almoço' | 'Jantar' | 'Sobremesa' | 'Snacks'

interface RecipeStep {
  title: string
  body:  string
  tip?:  string
}

// Shape retornado em GET /recipes e listagens
interface RecipeListItem {
  id:          string
  name:        string
  category:    Category
  time_min:    number      // minutos
  difficulty:  Difficulty
  portions:    number
  calories?:   number
  img_url?:    string      // URL pública do Supabase Storage
  description?: string
  is_public:   boolean
  created_at:  string      // ISO 8601
}

// Shape retornado em GET /recipes/:id
interface Recipe extends RecipeListItem {
  owner_id:  string
  notes?:    string
  updated_at: string
  ingredients: string[]
  steps:      RecipeStep[]
}

interface Profile {
  id:          string
  username?:   string
  bio?:        string
  avatar_url?: string
  is_premium:  boolean
  created_at:  string
  stats: {
    recipes_created: number
    favorites:       number
  }
}

interface Collection {
  id:           string
  name:         string
  emoji:        string
  recipe_count: number
}

interface CategoryStat {
  name:  Category
  emoji: string
  count: number   // receitas públicas nessa categoria
}
```

Todas as respostas seguem o envelope `{ data: T }`. Erros: `{ error: string, status: number }`.

---

## Receitas

### `GET /api/recipes`
Lista receitas do usuário autenticado + receitas públicas.

**Query params:**
| Param | Tipo | Descrição |
|---|---|---|
| `search` | string | Filtro parcial por nome (case-insensitive) |
| `category` | Category | Filtro exato por categoria |
| `limit` | number | Default 20, max 100 |
| `offset` | number | Default 0 |

**Response 200:**
```json
{ "data": RecipeListItem[] }
```

---

### `POST /api/recipes`
Cria uma nova receita.

**Body:**
```typescript
{
  name:        string           // required, max 120
  category:    Category         // required
  time_min:    number           // required, > 0
  difficulty:  Difficulty       // required
  portions:    number           // required, > 0
  calories?:   number
  description?: string          // max 500
  notes?:      string           // max 1000
  is_public?:  boolean          // default false
  ingredients: string[]         // required, min 1 item
  steps: Array<{
    title: string
    body:  string
    tip?:  string
  }>                            // required, min 1 item
}
```

**Response 201:** `{ "data": Recipe }`

---

### `GET /api/recipes/:id`
Retorna receita completa com ingredientes e passos.

**Response 200:** `{ "data": Recipe }`
**Response 404:** receita não encontrada ou sem acesso

---

### `PUT /api/recipes/:id`
Atualiza receita (apenas owner). Campos são opcionais (PATCH semântico).

Se `ingredients` ou `steps` forem enviados, substituem completamente o array existente.

**Body:** todos os campos de `POST /api/recipes` são opcionais

**Response 200:** `{ "data": Recipe }`

---

### `DELETE /api/recipes/:id`
Remove receita e todos os ingredientes/passos associados (CASCADE).

**Response 200:** `{ "data": { "id": string } }`

---

### `POST /api/recipes/:id/photo`
Fluxo de upload de foto de receita. Ver `POST /api/upload/presign`.

---

## Favoritos

### `POST /api/recipes/:id/favorites`
Salva receita como favorita (idempotente).

**Response 200:**
```json
{ "data": { "recipe_id": string, "favorited": true } }
```

---

### `DELETE /api/recipes/:id/favorites`
Remove receita dos favoritos.

**Response 200:**
```json
{ "data": { "recipe_id": string, "favorited": false } }
```

---

### `GET /api/favorites`
Lista receitas favoritas do usuário autenticado.

**Query params:** `limit` (default 20, max 100), `offset` (default 0)

**Response 200:** `{ "data": RecipeListItem[] }`

---

## Categorias

### `GET /api/categories`
Lista categorias com contagem de receitas públicas.

**Response 200:**
```json
{
  "data": [
    { "name": "Café da manhã", "emoji": "☕", "count": 12 },
    { "name": "Almoço",        "emoji": "🍝", "count": 28 },
    { "name": "Jantar",        "emoji": "🍷", "count": 24 },
    { "name": "Sobremesa",     "emoji": "🍰", "count": 18 },
    { "name": "Snacks",        "emoji": "🥑", "count": 9  }
  ]
}
```

---

## Perfil

### `GET /api/profile`
Retorna perfil do usuário autenticado com stats calculados.

**Response 200:** `{ "data": Profile }`

---

### `PUT /api/profile`
Atualiza username e/ou bio.

**Body:**
```typescript
{
  username?: string   // max 60
  bio?:      string   // max 300
}
```

**Response 200:** `{ "data": Profile }`

---

### `POST /api/profile/photo`
Fluxo de upload de avatar. Ver `POST /api/upload/presign` com `type: "avatar"`.

---

## Coleções

### `GET /api/profile/collections`
Lista coleções do usuário com contagem de receitas.

**Response 200:** `{ "data": Collection[] }`

---

### `POST /api/profile/collections`
Cria nova coleção.

**Body:**
```typescript
{
  name:   string   // required, max 60
  emoji?: string   // default "📚"
}
```

**Response 201:** `{ "data": Collection }`

---

## Upload de imagens

### `POST /api/upload/presign`
Gera presigned URL para upload direto ao Supabase Storage.

**Body:**
```typescript
{
  type: 'recipe' | 'avatar'
  id:   string   // UUID da receita ou do usuário
}
```

**Response 200:**
```json
{
  "data": {
    "upload_url": "https://...supabase.co/storage/v1/object/upload/sign/saveur-images/recipes/uuid.jpg?token=...",
    "public_url": "https://...supabase.co/storage/v1/object/public/saveur-images/recipes/uuid.jpg",
    "path":       "recipes/uuid.jpg"
  }
}
```

**Fluxo de uso no frontend:**
1. Chamar `POST /api/upload/presign` com o UUID da receita/avatar
2. Fazer `PUT <upload_url>` com o arquivo binário e header `Content-Type: image/jpeg`
3. Salvar `public_url` em `recipes.img_url` ou `profiles.avatar_url` via `PUT /api/recipes/:id` ou `PUT /api/profile`

---

## Erros

| Status | Descrição |
|--------|-----------|
| 400 | Validação falhou — ver mensagem no campo `error` |
| 401 | Token ausente, inválido ou expirado |
| 404 | Recurso não encontrado |
| 500 | Erro interno do servidor |

---

## Mapeamento frontend ↔ API

| Campo `data.js` | Campo API | Observação |
|---|---|---|
| `id` | `id` | |
| `name` | `name` | |
| `category` | `category` | |
| `time` | `time_min` | renomeado para clareza |
| `difficulty` | `difficulty` | |
| `portions` | `portions` | |
| `calories` | `calories` | opcional |
| `img` | `img_url` | URL pública do Storage |
| `desc` | `description` | |
| `ingredients` | `ingredients` | array de strings |
| `steps[].t` | `steps[].title` | renomeado |
| `steps[].d` | `steps[].body` | renomeado |
| `steps[].tip` | `steps[].tip` | opcional |
