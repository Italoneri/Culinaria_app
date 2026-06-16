import { describe, it, expect, vi } from 'vitest'

const TEST_USER_ID = '00000000-0000-0000-0000-000000000001'
const TEST_TOKEN = 'test-bearer-token'
const RECIPE_UUID = '123e4567-e89b-12d3-a456-426614174000'
const USER_UUID = '00000000-0000-0000-0000-000000000001'

const mockStorageFrom = vi.fn()
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
    storage: {
      from: mockStorageFrom,
    },
  })),
}))

import app from '../../src/index'

const AUTH = { Authorization: `Bearer ${TEST_TOKEN}` }
const JSON_HEADERS = { ...AUTH, 'Content-Type': 'application/json' }

const mockSignedUpload = {
  data: { signedUrl: 'https://supabase.co/storage/v1/object/upload/sign/saveur-images/recipes/uuid.jpg?token=abc' },
  error: null,
}

const mockPublicUrl = {
  data: { publicUrl: 'https://supabase.co/storage/v1/object/public/saveur-images/recipes/uuid.jpg' },
}

// ── POST /api/upload/presign ────────────────────────────────────────────────

describe('POST /api/upload/presign', () => {
  beforeEach(() => {
    mockStorageFrom.mockReturnValue({
      createSignedUploadUrl: vi.fn().mockResolvedValue(mockSignedUpload),
      getPublicUrl: vi.fn().mockReturnValue(mockPublicUrl),
    })
  })

  it('returns 200 with upload_url, public_url and path for recipe type', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/upload/presign', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ type: 'recipe', id: RECIPE_UUID }),
      }),
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveProperty('upload_url')
    expect(body.data).toHaveProperty('public_url')
    expect(body.data).toHaveProperty('path')
  })

  it('path for recipe type is "recipes/{id}.jpg"', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/upload/presign', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ type: 'recipe', id: RECIPE_UUID }),
      }),
    )
    const body = await res.json()
    expect(body.data.path).toBe(`recipes/${RECIPE_UUID}.jpg`)
  })

  it('path for avatar type is "avatars/{id}.jpg"', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/upload/presign', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ type: 'avatar', id: USER_UUID }),
      }),
    )
    const body = await res.json()
    expect(body.data.path).toBe(`avatars/${USER_UUID}.jpg`)
  })

  it('returns 400 when type is invalid', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/upload/presign', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ type: 'document', id: RECIPE_UUID }),
      }),
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 when id is not a valid UUID', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/upload/presign', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ type: 'recipe', id: 'not-a-uuid' }),
      }),
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 when body is missing type', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/upload/presign', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ id: RECIPE_UUID }),
      }),
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 when body is missing id', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/upload/presign', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ type: 'recipe' }),
      }),
    )
    expect(res.status).toBe(400)
  })

  it('returns 500 when Supabase Storage errors', async () => {
    mockStorageFrom.mockReturnValue({
      createSignedUploadUrl: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'storage error' },
      }),
      getPublicUrl: vi.fn().mockReturnValue(mockPublicUrl),
    })

    const res = await app.fetch(
      new Request('http://localhost/api/upload/presign', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ type: 'recipe', id: RECIPE_UUID }),
      }),
    )
    expect(res.status).toBe(500)
  })

  it('upload_url is a non-empty string', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/upload/presign', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ type: 'recipe', id: RECIPE_UUID }),
      }),
    )
    const body = await res.json()
    expect(typeof body.data.upload_url).toBe('string')
    expect(body.data.upload_url.length).toBeGreaterThan(0)
  })
})
