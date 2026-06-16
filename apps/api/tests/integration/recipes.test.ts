import { describe, it, expect, vi, beforeEach } from 'vitest'

const TEST_USER_ID = '00000000-0000-0000-0000-000000000001'
const TEST_TOKEN = 'test-bearer-token'

const mockFrom = vi.fn()

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: TEST_USER_ID } },
        error: null,
      }),
    },
    from: mockFrom,
    storage: { from: vi.fn() },
  })),
}))

import app from '../../src/index'

const AUTH = { Authorization: `Bearer ${TEST_TOKEN}` }
const JSON_HEADERS = { ...AUTH, 'Content-Type': 'application/json' }

// ── Factories ──────────────────────────────────────────────────────────────

function makeRecipeRow(overrides = {}) {
  return {
    id: 'recipe-uuid-1',
    name: 'Risoto de cogumelos',
    category: 'Jantar',
    time_min: 45,
    difficulty: 'Médio',
    portions: 4,
    calories: 520,
    img_url: null,
    description: 'Cremoso e elegante',
    is_public: false,
    created_at: '2026-01-01T00:00:00Z',
    owner_id: TEST_USER_ID,
    notes: null,
    updated_at: '2026-01-01T00:00:00Z',
    recipe_ingredients: [
      { position: 0, text: '300g de arroz arbóreo' },
      { position: 1, text: '500g de cogumelos' },
    ],
    recipe_steps: [
      { position: 0, title: 'Refogue a base', body: 'Doure a cebola', tip: null },
      { position: 1, title: 'Adicione o caldo', body: 'Uma concha por vez', tip: 'Mantenha quente' },
    ],
    ...overrides,
  }
}

function buildChain(resolvedValue: unknown) {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {}
  const terminal = vi.fn().mockResolvedValue(resolvedValue)

  for (const m of ['select', 'insert', 'update', 'delete', 'upsert', 'eq', 'or', 'ilike', 'order', 'range', 'single']) {
    chain[m] = vi.fn().mockReturnValue(chain)
  }
  chain['single'] = terminal
  chain['range'] = terminal

  // Allow direct await on the chain (for cases without .single() / .range())
  ;(chain as unknown as PromiseLike<unknown>).then = (resolve: (v: unknown) => unknown) =>
    Promise.resolve(resolvedValue).then(resolve)

  return chain
}

// ── GET /api/recipes ────────────────────────────────────────────────────────

describe('GET /api/recipes', () => {
  it('returns 200 with data array', async () => {
    const row = makeRecipeRow()
    const chain = buildChain({ data: [row], error: null })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(new Request('http://localhost/api/recipes', { headers: AUTH }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body.data)).toBe(true)
  })

  it('applies category filter via query param', async () => {
    const chain = buildChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    await app.fetch(
      new Request('http://localhost/api/recipes?category=Jantar', { headers: AUTH }),
    )
    // .eq() should have been called with 'category' and 'Jantar'
    expect(chain.eq).toHaveBeenCalledWith('category', 'Jantar')
  })

  it('applies search filter via query param', async () => {
    const chain = buildChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    await app.fetch(
      new Request('http://localhost/api/recipes?search=risoto', { headers: AUTH }),
    )
    expect(chain.ilike).toHaveBeenCalledWith('name', '%risoto%')
  })

  it('caps limit at 100', async () => {
    const chain = buildChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    await app.fetch(
      new Request('http://localhost/api/recipes?limit=999', { headers: AUTH }),
    )
    // range(0, 99) — offset 0, limit capped at 100 → range end = 0 + 100 - 1 = 99
    expect(chain.range).toHaveBeenCalledWith(0, 99)
  })

  it('returns 500 envelope when Supabase errors', async () => {
    const chain = buildChain({ data: null, error: { message: 'db error' } })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(new Request('http://localhost/api/recipes', { headers: AUTH }))
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(typeof body.error).toBe('string')
  })
})

// ── POST /api/recipes ───────────────────────────────────────────────────────

describe('POST /api/recipes', () => {
  const validBody = {
    name: 'Bolo de cenoura',
    category: 'Sobremesa',
    time_min: 60,
    difficulty: 'Fácil',
    portions: 8,
    ingredients: ['3 cenouras', '2 ovos'],
    steps: [{ title: 'Bata', body: 'Bata tudo no liquidificador' }],
  }

  it('returns 201 with created recipe on valid payload', async () => {
    const row = makeRecipeRow({ id: 'new-uuid', name: 'Bolo de cenoura' })
    const insertChain = buildChain({ data: { id: 'new-uuid' }, error: null })
    const selectChain = buildChain({ data: row, error: null })
    const insertIngChain = buildChain({ data: null, error: null })
    const insertStepChain = buildChain({ data: null, error: null })

    mockFrom
      .mockReturnValueOnce(insertChain)        // recipes INSERT
      .mockReturnValueOnce(insertIngChain)     // recipe_ingredients INSERT
      .mockReturnValueOnce(insertStepChain)    // recipe_steps INSERT
      .mockReturnValue(selectChain)            // final SELECT

    const res = await app.fetch(
      new Request('http://localhost/api/recipes', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(validBody),
      }),
    )
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.data).toBeDefined()
    expect(body.data.ingredients).toBeInstanceOf(Array)
    expect(body.data.steps).toBeInstanceOf(Array)
  })

  it('returns 400 when name is missing', async () => {
    const { name: _n, ...noName } = validBody
    const res = await app.fetch(
      new Request('http://localhost/api/recipes', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(noName),
      }),
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 when ingredients array is empty', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/recipes', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ ...validBody, ingredients: [] }),
      }),
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 when steps array is empty', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/recipes', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ ...validBody, steps: [] }),
      }),
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 when category is not a valid enum value', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/recipes', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ ...validBody, category: 'Invalida' }),
      }),
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 when difficulty is not a valid enum value', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/recipes', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ ...validBody, difficulty: 'Expert' }),
      }),
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 when time_min is zero', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/recipes', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ ...validBody, time_min: 0 }),
      }),
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 when portions is zero', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/recipes', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ ...validBody, portions: 0 }),
      }),
    )
    expect(res.status).toBe(400)
  })

  it('normalizes ingredients and steps sorted by position', async () => {
    const row = makeRecipeRow({
      recipe_ingredients: [
        { position: 1, text: 'Segundo' },
        { position: 0, text: 'Primeiro' },
      ],
      recipe_steps: [
        { position: 1, title: 'Passo 2', body: 'B', tip: null },
        { position: 0, title: 'Passo 1', body: 'A', tip: null },
      ],
    })
    const insertChain = buildChain({ data: { id: 'new-uuid' }, error: null })
    const insertIngChain = buildChain({ data: null, error: null })
    const insertStepChain = buildChain({ data: null, error: null })
    const selectChain = buildChain({ data: row, error: null })

    mockFrom
      .mockReturnValueOnce(insertChain)
      .mockReturnValueOnce(insertIngChain)
      .mockReturnValueOnce(insertStepChain)
      .mockReturnValue(selectChain)

    const res = await app.fetch(
      new Request('http://localhost/api/recipes', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(validBody),
      }),
    )
    const body = await res.json()
    expect(body.data.ingredients[0]).toBe('Primeiro')
    expect(body.data.steps[0].title).toBe('Passo 1')
  })
})

// ── GET /api/recipes/:id ────────────────────────────────────────────────────

describe('GET /api/recipes/:id', () => {
  it('returns 200 with full recipe including ingredients and steps', async () => {
    const row = makeRecipeRow()
    const chain = buildChain({ data: row, error: null })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(
      new Request('http://localhost/api/recipes/recipe-uuid-1', { headers: AUTH }),
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.id).toBe('recipe-uuid-1')
    expect(Array.isArray(body.data.ingredients)).toBe(true)
    expect(Array.isArray(body.data.steps)).toBe(true)
  })

  it('returns 404 when recipe does not exist', async () => {
    const chain = buildChain({ data: null, error: { message: 'not found' } })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(
      new Request('http://localhost/api/recipes/nonexistent-id', { headers: AUTH }),
    )
    expect(res.status).toBe(404)
  })

  it('step without tip does not include tip key', async () => {
    const row = makeRecipeRow({
      recipe_steps: [{ position: 0, title: 'Único passo', body: 'Faça isso', tip: null }],
    })
    const chain = buildChain({ data: row, error: null })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(
      new Request('http://localhost/api/recipes/recipe-uuid-1', { headers: AUTH }),
    )
    const body = await res.json()
    expect('tip' in body.data.steps[0]).toBe(false)
  })
})

// ── PUT /api/recipes/:id ────────────────────────────────────────────────────

describe('PUT /api/recipes/:id', () => {
  it('returns 200 with updated recipe', async () => {
    const updated = makeRecipeRow({ name: 'Risoto atualizado' })
    const updateChain = buildChain({ data: null, error: null })
    const selectChain = buildChain({ data: updated, error: null })

    mockFrom
      .mockReturnValueOnce(updateChain)
      .mockReturnValue(selectChain)

    const res = await app.fetch(
      new Request('http://localhost/api/recipes/recipe-uuid-1', {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify({ name: 'Risoto atualizado' }),
      }),
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.name).toBe('Risoto atualizado')
  })

  it('returns 400 when name exceeds 120 characters', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/recipes/recipe-uuid-1', {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify({ name: 'A'.repeat(121) }),
      }),
    )
    expect(res.status).toBe(400)
  })

  it('replaces ingredients array completely when provided', async () => {
    const deleteChain = buildChain({ data: null, error: null })
    const insertChain = buildChain({ data: null, error: null })
    const selectChain = buildChain({ data: makeRecipeRow(), error: null })

    mockFrom
      .mockReturnValueOnce(deleteChain)  // DELETE old ingredients
      .mockReturnValueOnce(insertChain)  // INSERT new ingredients
      .mockReturnValue(selectChain)

    await app.fetch(
      new Request('http://localhost/api/recipes/recipe-uuid-1', {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify({ ingredients: ['Novo ingrediente'] }),
      }),
    )

    expect(deleteChain.delete).toHaveBeenCalled()
    expect(insertChain.insert).toHaveBeenCalled()
  })
})

// ── DELETE /api/recipes/:id ─────────────────────────────────────────────────

describe('DELETE /api/recipes/:id', () => {
  it('returns 200 with deleted id', async () => {
    const chain = buildChain({ data: null, error: null })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(
      new Request('http://localhost/api/recipes/recipe-uuid-1', {
        method: 'DELETE',
        headers: AUTH,
      }),
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.id).toBe('recipe-uuid-1')
  })

  it('is idempotent — second delete also returns 200', async () => {
    const chain = buildChain({ data: null, error: null })
    mockFrom.mockReturnValue(chain)

    const del = () =>
      app.fetch(
        new Request('http://localhost/api/recipes/recipe-uuid-1', {
          method: 'DELETE',
          headers: AUTH,
        }),
      )

    const [r1, r2] = await Promise.all([del(), del()])
    expect(r1.status).toBe(200)
    expect(r2.status).toBe(200)
  })
})
