import { vi } from 'vitest'
import type { Mock } from 'vitest'

// Re-exported app — imported fresh per test file to avoid module state bleed
export { default as app } from '../../src/index'

// Auth token used across all tests
export const TEST_TOKEN = 'test-bearer-token'
export const TEST_USER_ID = '00000000-0000-0000-0000-000000000001'
export const TEST_USER_ID_B = '00000000-0000-0000-0000-000000000002'

export function authHeaders(token = TEST_TOKEN) {
  return { Authorization: `Bearer ${token}` }
}

// Build a request targeting the Hono app directly (no HTTP server needed)
export function req(
  path: string,
  options: RequestInit & { params?: Record<string, string> } = {},
) {
  const url = `http://localhost${path}`
  return new Request(url, options)
}

export function jsonReq(
  path: string,
  method: string,
  body: unknown,
  token = TEST_TOKEN,
) {
  return req(path, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
}

// Minimal Supabase query-builder chain factory.
// Pass `result` as { data, error } to control what the chain resolves to.
export function mockChain(result: { data?: unknown; error?: unknown; count?: number | null }) {
  const chain: Record<string, Mock> = {}
  const self = () => chain

  for (const method of [
    'select', 'insert', 'update', 'delete', 'upsert',
    'eq', 'or', 'ilike', 'order', 'range', 'single',
  ]) {
    chain[method] = vi.fn(self)
  }

  // Terminal call resolves to result
  chain['single'] = vi.fn().mockResolvedValue(result)
  chain['range'] = vi.fn().mockResolvedValue(result)

  // Allow select().eq()...  to also resolve
  const awaitable = {
    ...chain,
    then: (resolve: (v: typeof result) => void) => Promise.resolve(result).then(resolve),
  }

  for (const method of Object.keys(chain)) {
    chain[method] = vi.fn(() => awaitable)
  }
  chain['single'] = vi.fn().mockResolvedValue(result)

  return chain
}
