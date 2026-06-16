import { describe, it, expect, vi } from 'vitest'

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

function buildChain(resolvedValue: unknown) {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {}
  for (const m of ['select', 'insert', 'update', 'delete', 'upsert', 'eq', 'order', 'range', 'single']) {
    chain[m] = vi.fn().mockReturnValue(chain)
  }
  chain['single'] = vi.fn().mockResolvedValue(resolvedValue)
  ;(chain as unknown as PromiseLike<unknown>).then = (resolve: (v: unknown) => unknown) =>
    Promise.resolve(resolvedValue).then(resolve)
  return chain
}

const profileRow = {
  id: TEST_USER_ID,
  username: 'mariana',
  bio: 'Cozinheira amadora',
  avatar_url: null,
  is_premium: true,
  created_at: '2026-01-01T00:00:00Z',
}

// ── GET /api/profile ────────────────────────────────────────────────────────

describe('GET /api/profile', () => {
  it('returns 200 with profile data and stats', async () => {
    const profileChain = buildChain({ data: profileRow, error: null })
    const recipesChain = buildChain({ data: null, error: null, count: 12 })
    const favChain = buildChain({ data: null, error: null, count: 28 })

    // Promise.all order: profile, recipes count, favorites count
    mockFrom
      .mockReturnValueOnce(profileChain)
      .mockReturnValueOnce(recipesChain)
      .mockReturnValueOnce(favChain)

    const res = await app.fetch(new Request('http://localhost/api/profile', { headers: AUTH }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.id).toBe(TEST_USER_ID)
    expect(body.data.stats).toBeDefined()
    expect(typeof body.data.stats.recipes_created).toBe('number')
    expect(typeof body.data.stats.favorites).toBe('number')
  })

  it('stats.recipes_created reflects number of own recipes', async () => {
    const profileChain = buildChain({ data: profileRow, error: null })
    const recipesChain = buildChain({ data: null, error: null, count: 5 })
    const favChain = buildChain({ data: null, error: null, count: 0 })

    mockFrom
      .mockReturnValueOnce(profileChain)
      .mockReturnValueOnce(recipesChain)
      .mockReturnValueOnce(favChain)

    const res = await app.fetch(new Request('http://localhost/api/profile', { headers: AUTH }))
    const body = await res.json()
    expect(body.data.stats.recipes_created).toBe(5)
  })

  it('stats default to 0 when count is null', async () => {
    const profileChain = buildChain({ data: profileRow, error: null })
    const recipesChain = buildChain({ data: null, error: null, count: null })
    const favChain = buildChain({ data: null, error: null, count: null })

    mockFrom
      .mockReturnValueOnce(profileChain)
      .mockReturnValueOnce(recipesChain)
      .mockReturnValueOnce(favChain)

    const res = await app.fetch(new Request('http://localhost/api/profile', { headers: AUTH }))
    const body = await res.json()
    expect(body.data.stats.recipes_created).toBe(0)
    expect(body.data.stats.favorites).toBe(0)
  })

  it('returns 404 when profile not found', async () => {
    const profileChain = buildChain({ data: null, error: { message: 'not found' } })
    const recipesChain = buildChain({ data: null, error: null, count: 0 })
    const favChain = buildChain({ data: null, error: null, count: 0 })

    mockFrom
      .mockReturnValueOnce(profileChain)
      .mockReturnValueOnce(recipesChain)
      .mockReturnValueOnce(favChain)

    const res = await app.fetch(new Request('http://localhost/api/profile', { headers: AUTH }))
    expect(res.status).toBe(404)
  })
})

// ── PUT /api/profile ────────────────────────────────────────────────────────

describe('PUT /api/profile', () => {
  it('returns 200 with updated profile', async () => {
    const updated = { ...profileRow, username: 'mariana_nova', bio: 'Nova bio' }
    const chain = buildChain({ data: updated, error: null })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(
      new Request('http://localhost/api/profile', {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify({ username: 'mariana_nova', bio: 'Nova bio' }),
      }),
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.username).toBe('mariana_nova')
  })

  it('returns 400 when username exceeds 60 characters', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/profile', {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify({ username: 'u'.repeat(61) }),
      }),
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 when bio exceeds 300 characters', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/profile', {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify({ bio: 'b'.repeat(301) }),
      }),
    )
    expect(res.status).toBe(400)
  })

  it('accepts partial update — only bio without username', async () => {
    const chain = buildChain({ data: { ...profileRow, bio: 'Só bio atualizada' }, error: null })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(
      new Request('http://localhost/api/profile', {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify({ bio: 'Só bio atualizada' }),
      }),
    )
    expect(res.status).toBe(200)
  })
})

// ── GET /api/profile/collections ───────────────────────────────────────────

describe('GET /api/profile/collections', () => {
  it('returns 200 with array of collections', async () => {
    const chain = buildChain({
      data: [
        { id: 'col-1', name: 'Jantar romântico', emoji: '🍷', collection_recipes: [{ count: 8 }] },
        { id: 'col-2', name: 'Quick & Easy', emoji: '⚡', collection_recipes: [{ count: 22 }] },
      ],
      error: null,
    })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(
      new Request('http://localhost/api/profile/collections', { headers: AUTH }),
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data[0].recipe_count).toBe(8)
    expect(body.data[1].recipe_count).toBe(22)
  })

  it('each collection has id, name, emoji, recipe_count', async () => {
    const chain = buildChain({
      data: [{ id: 'col-1', name: 'Test', emoji: '📚', collection_recipes: [{ count: 3 }] }],
      error: null,
    })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(
      new Request('http://localhost/api/profile/collections', { headers: AUTH }),
    )
    const body = await res.json()
    const col = body.data[0]
    expect(col).toHaveProperty('id')
    expect(col).toHaveProperty('name')
    expect(col).toHaveProperty('emoji')
    expect(col).toHaveProperty('recipe_count')
  })

  it('recipe_count defaults to 0 when no recipes in collection', async () => {
    const chain = buildChain({
      data: [{ id: 'col-1', name: 'Vazia', emoji: '📚', collection_recipes: [] }],
      error: null,
    })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(
      new Request('http://localhost/api/profile/collections', { headers: AUTH }),
    )
    const body = await res.json()
    expect(body.data[0].recipe_count).toBe(0)
  })
})

// ── POST /api/profile/collections ──────────────────────────────────────────

describe('POST /api/profile/collections', () => {
  it('returns 201 with created collection and recipe_count 0', async () => {
    const chain = buildChain({
      data: { id: 'new-col', name: 'Minha coleção', emoji: '🥗', owner_id: TEST_USER_ID },
      error: null,
    })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(
      new Request('http://localhost/api/profile/collections', {
        method: 'POST',
        headers: { ...AUTH, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Minha coleção', emoji: '🥗' }),
      }),
    )
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.data.name).toBe('Minha coleção')
    expect(body.data.recipe_count).toBe(0)
  })

  it('uses default emoji "📚" when not provided', async () => {
    const chain = buildChain({
      data: { id: 'new-col', name: 'Sem emoji', emoji: '📚', owner_id: TEST_USER_ID },
      error: null,
    })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(
      new Request('http://localhost/api/profile/collections', {
        method: 'POST',
        headers: { ...AUTH, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Sem emoji' }),
      }),
    )
    expect(res.status).toBe(201)
  })

  it('returns 400 when name is missing', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/profile/collections', {
        method: 'POST',
        headers: { ...AUTH, 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji: '🥗' }),
      }),
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 when name exceeds 60 characters', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/profile/collections', {
        method: 'POST',
        headers: { ...AUTH, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'N'.repeat(61) }),
      }),
    )
    expect(res.status).toBe(400)
  })
})
