import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Supabase before importing the app so the module sees the mock
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: { message: 'invalid' } }),
    },
    from: vi.fn(),
    storage: { from: vi.fn() },
  })),
}))

import app from '../../src/index'

describe('Auth middleware', () => {
  it('returns 401 when Authorization header is missing', async () => {
    const res = await app.fetch(new Request('http://localhost/api/recipes'))
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body).toHaveProperty('error')
    expect(body).toHaveProperty('status', 401)
  })

  it('returns 401 when token does not start with "Bearer "', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/recipes', {
        headers: { Authorization: 'Basic dXNlcjpwYXNz' },
      }),
    )
    expect(res.status).toBe(401)
  })

  it('returns 401 when Supabase rejects the token', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/recipes', {
        headers: { Authorization: 'Bearer invalid-token' },
      }),
    )
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toMatch(/invalid|expired/i)
  })

  it('returns 200 on /health without auth', async () => {
    const res = await app.fetch(new Request('http://localhost/health'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ status: 'ok' })
  })

  it('error envelope always contains "error" string and "status" number', async () => {
    const res = await app.fetch(new Request('http://localhost/api/recipes'))
    const body = await res.json()
    expect(typeof body.error).toBe('string')
    expect(typeof body.status).toBe('number')
  })
})
