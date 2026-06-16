import type { Recipe, Category } from '@/lib/data'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
const REQUEST_TIMEOUT_MS = 10_000

export class ApiFetchError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
    this.name = 'ApiFetchError'
  }
}

async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  token?: string,
): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers as Record<string, string> ?? {}),
    }
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers,
      signal: controller.signal,
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: res.statusText }))
      throw new ApiFetchError(res.status, (body as { error: string }).error)
    }
    const body = await res.json()
    return (body as { data: T }).data
  } finally {
    clearTimeout(timeoutId)
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type RecipeFilters = {
  category?: string
  q?: string
  limit?: number
  offset?: number
}

export type CreateRecipeBody = {
  name: string
  category: string
  time_min: number
  difficulty: string
  portions: number
  calories?: number
  description?: string
  notes?: string
  is_public?: boolean
  ingredients: string[]
  steps: Array<{ title: string; body: string; tip?: string }>
}

export type Profile = {
  id: string
  username?: string
  bio?: string
  avatar_url?: string
  is_premium: boolean
  created_at: string
  stats: { recipes_created: number; favorites: number }
}

export type PresignResponse = {
  upload_url: string
  public_url: string
  path: string
}

// ─── Public endpoints (no auth) ───────────────────────────────────────────────

export async function getRecipes(filters: RecipeFilters = {}): Promise<Recipe[]> {
  const params = new URLSearchParams()
  if (filters.category) params.set('category', filters.category)
  if (filters.q) params.set('q', filters.q)
  if (filters.limit != null) params.set('limit', String(filters.limit))
  if (filters.offset != null) params.set('offset', String(filters.offset))
  const query = params.toString()
  return apiFetch<Recipe[]>(`/api/recipes${query ? `?${query}` : ''}`)
}

export async function getRecipe(id: string): Promise<Recipe> {
  return apiFetch<Recipe>(`/api/recipes/${id}`)
}

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>('/api/categories')
}

// ─── Authenticated endpoints ──────────────────────────────────────────────────

export async function createRecipe(body: CreateRecipeBody, token: string): Promise<Recipe> {
  return apiFetch<Recipe>('/api/recipes', { method: 'POST', body: JSON.stringify(body) }, token)
}

export async function updateRecipe(id: string, body: Partial<CreateRecipeBody>, token: string): Promise<Recipe> {
  return apiFetch<Recipe>(`/api/recipes/${id}`, { method: 'PUT', body: JSON.stringify(body) }, token)
}

export async function deleteRecipe(id: string, token: string): Promise<void> {
  await apiFetch<{ id: string }>(`/api/recipes/${id}`, { method: 'DELETE' }, token)
}

export async function getProfile(token: string): Promise<Profile> {
  return apiFetch<Profile>('/api/profile', undefined, token)
}

export async function updateProfile(body: { username?: string; bio?: string }, token: string): Promise<Profile> {
  return apiFetch<Profile>('/api/profile', { method: 'PUT', body: JSON.stringify(body) }, token)
}

export async function getFavorites(token: string): Promise<Recipe[]> {
  return apiFetch<Recipe[]>('/api/favorites', undefined, token)
}

export async function addFavorite(recipeId: string, token: string): Promise<void> {
  await apiFetch<unknown>(`/api/recipes/${recipeId}/favorites`, { method: 'POST' }, token)
}

export async function removeFavorite(recipeId: string, token: string): Promise<void> {
  await apiFetch<unknown>(`/api/recipes/${recipeId}/favorites`, { method: 'DELETE' }, token)
}

export async function presignUpload(
  type: 'recipe' | 'avatar',
  id: string,
  token: string,
): Promise<PresignResponse> {
  return apiFetch<PresignResponse>(
    '/api/upload/presign',
    { method: 'POST', body: JSON.stringify({ type, id }) },
    token,
  )
}
