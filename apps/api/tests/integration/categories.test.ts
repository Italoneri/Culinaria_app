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

function buildChain(resolvedValue: unknown) {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {}
  for (const m of ['select', 'eq', 'order', 'range', 'single']) {
    chain[m] = vi.fn().mockReturnValue(chain)
  }
  ;(chain as unknown as PromiseLike<unknown>).then = (resolve: (v: unknown) => unknown) =>
    Promise.resolve(resolvedValue).then(resolve)
  return chain
}

describe('GET /api/categories', () => {
  it('returns 200 with all 5 categories', async () => {
    const chain = buildChain({
      data: [
        { category: 'Café da manhã' },
        { category: 'Café da manhã' },
        { category: 'Almoço' },
        { category: 'Jantar' },
        { category: 'Jantar' },
        { category: 'Sobremesa' },
        { category: 'Snacks' },
      ],
      error: null,
    })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(new Request('http://localhost/api/categories', { headers: AUTH }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data).toHaveLength(5)
  })

  it('each category entry has name, emoji, and count fields', async () => {
    const chain = buildChain({ data: [{ category: 'Jantar' }], error: null })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(new Request('http://localhost/api/categories', { headers: AUTH }))
    const body = await res.json()

    for (const cat of body.data) {
      expect(typeof cat.name).toBe('string')
      expect(typeof cat.emoji).toBe('string')
      expect(typeof cat.count).toBe('number')
    }
  })

  it('counts reflect only public recipes', async () => {
    const chain = buildChain({
      data: [{ category: 'Jantar' }, { category: 'Jantar' }],
      error: null,
    })
    mockFrom.mockReturnValue(chain)

    await app.fetch(new Request('http://localhost/api/categories', { headers: AUTH }))

    // Must filter by is_public = true
    expect(chain.eq).toHaveBeenCalledWith('is_public', true)
  })

  it('returns count 0 for categories with no public recipes', async () => {
    // Only one category represented in data
    const chain = buildChain({ data: [{ category: 'Jantar' }], error: null })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(new Request('http://localhost/api/categories', { headers: AUTH }))
    const body = await res.json()

    const snacks = body.data.find((c: { name: string }) => c.name === 'Snacks')
    expect(snacks?.count).toBe(0)
  })

  it('categories are returned in the canonical order', async () => {
    const chain = buildChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(new Request('http://localhost/api/categories', { headers: AUTH }))
    const body = await res.json()
    const names = body.data.map((c: { name: string }) => c.name)

    expect(names).toEqual(['Café da manhã', 'Almoço', 'Jantar', 'Sobremesa', 'Snacks'])
  })

  it('correct emoji for each category', async () => {
    const chain = buildChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    const res = await app.fetch(new Request('http://localhost/api/categories', { headers: AUTH }))
    const body = await res.json()

    const expected: Record<string, string> = {
      'Café da manhã': '☕',
      'Almoço': '🍝',
      'Jantar': '🍷',
      'Sobremesa': '🍰',
      'Snacks': '🥑',
    }

    for (const cat of body.data) {
      expect(cat.emoji).toBe(expected[cat.name])
    }
  })
})
