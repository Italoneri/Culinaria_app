import type { Recipe, Category } from '@/lib/data'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
const REQUEST_TIMEOUT_MS = 10_000

class ApiFetchError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
    this.name = 'ApiFetchError'
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const res = await fetch(`${API_BASE}${path}`, { ...init, signal: controller.signal })
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

export type RecipeFilters = {
  category?: string
  q?: string
  limit?: number
  offset?: number
}

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
