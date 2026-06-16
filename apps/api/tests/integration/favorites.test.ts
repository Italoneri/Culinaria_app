import { describe, it, expect, vi, beforeEach } from 'vitest'

const TEST_USER_ID = '00000000-0000-0000-0000-000000000001'
const TEST_TOKEN = 'test-bearer-token'
const RECIPE_ID = 'recipe-uuid-1'

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

function buildChain(resolvedValue: unknown) {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {}

  for (const m of ['select', 'insert', 'update', 'delete', 'upsert', 'eq', 'or', 'ilike', 'order', 'range', 'single']) {
    chain[m] = vi.fn().mockReturnValue(chain)
  }

  const terminal = vi.fn().mockResolvedValue(resolvedValue)
  chain['single'] = terminal
  chain['range'] = terminal

  ;(chain as unknown as PromiseLike<unknown>).then = (resolve: (v: unknown) => unknown) =>
    Promise.resolve(resolvedValue).then(resolve)

  return chain
}

// ── POST /api/recipes/:id/favorites ────────────────────────────────────────

describe('POST /api/recipes/:id/favorites', () => {
  it('returns 200 with favorited: true', async () => {
    const chain = buildChain({ data: null, error: null })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(
      new Request(`http://localhost/api/recipes/${RECIPE_ID}/favorites`, {
        method: 'POST',
        headers: AUTH,
      }),
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.recipe_id).toBe(RECIPE_ID)
    expect(body.data.favorited).toBe(true)
  })

  it('uses upsert — favoriting twice does not error', async () => {
    const chain = buildChain({ data: null, error: null })
    mockFrom.mockReturnValue(chain)

    const post = () =>
      app.fetch(
        new Request(`http://localhost/api/recipes/${RECIPE_ID}/favorites`, {
          method: 'POST',
          headers: AUTH,
        }),
      )

    const [r1, r2] = await Promise.all([post(), post()])
    expect(r1.status).toBe(200)
    expect(r2.status).toBe(200)
    // upsert should have been called (not insert)
    expect(chain.upsert).toHaveBeenCalled()
  })

  it('returns 500 envelope when Supabase errors', async () => {
    const chain = buildChain({ data: null, error: { message: 'db error' } })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(
      new Request(`http://localhost/api/recipes/${RECIPE_ID}/favorites`, {
        method: 'POST',
        headers: AUTH,
      }),
    )
    expect(res.status).toBe(500)
  })
})

// ── DELETE /api/recipes/:id/favorites ──────────────────────────────────────

describe('DELETE /api/recipes/:id/favorites', () => {
  it('returns 200 with favorited: false', async () => {
    const chain = buildChain({ data: null, error: null })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(
      new Request(`http://localhost/api/recipes/${RECIPE_ID}/favorites`, {
        method: 'DELETE',
        headers: AUTH,
      }),
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.recipe_id).toBe(RECIPE_ID)
    expect(body.data.favorited).toBe(false)
  })

  it('is idempotent — deleting a non-favorited recipe returns 200', async () => {
    const chain = buildChain({ data: null, error: null })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(
      new Request(`http://localhost/api/recipes/${RECIPE_ID}/favorites`, {
        method: 'DELETE',
        headers: AUTH,
      }),
    )
    expect(res.status).toBe(200)
  })
})

// ── GET /api/favorites ──────────────────────────────────────────────────────

describe('GET /api/favorites', () => {
  it('returns 200 with data array of RecipeListItem', async () => {
    const chain = buildChain({
      data: [
        {
          recipe_id: RECIPE_ID,
          recipes: {
            id: RECIPE_ID,
            name: 'Risoto',
            category: 'Jantar',
            time_min: 45,
            difficulty: 'Médio',
            portions: 4,
            calories: 520,
            img_url: null,
            description: null,
            is_public: false,
            created_at: '2026-01-01T00:00:00Z',
          },
        },
      ],
      error: null,
    })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(
      new Request('http://localhost/api/favorites', { headers: AUTH }),
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data[0].id).toBe(RECIPE_ID)
  })

  it('filters by authenticated user — eq called with user_id', async () => {
    const chain = buildChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    await app.fetch(new Request('http://localhost/api/favorites', { headers: AUTH }))

    expect(chain.eq).toHaveBeenCalledWith('user_id', TEST_USER_ID)
  })

  it('supports limit and offset pagination', async () => {
    const chain = buildChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    await app.fetch(
      new Request('http://localhost/api/favorites?limit=5&offset=10', { headers: AUTH }),
    )
    expect(chain.range).toHaveBeenCalledWith(10, 14)
  })

  it('caps limit at 100', async () => {
    const chain = buildChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    await app.fetch(
      new Request('http://localhost/api/favorites?limit=999', { headers: AUTH }),
    )
    expect(chain.range).toHaveBeenCalledWith(0, 99)
  })

  it('returns empty array when user has no favorites', async () => {
    const chain = buildChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(new Request('http://localhost/api/favorites', { headers: AUTH }))
    const body = await res.json()
    expect(body.data).toEqual([])
  })
})
