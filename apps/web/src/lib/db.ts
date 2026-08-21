import { createSupabaseServerClient } from './supabase-server'
import { CATEGORIES } from './data'
import type { Recipe, Category, Profile } from './data'

const LIST_COLUMNS =
  'id, name, category, time_min, difficulty, portions, calories, img_url, description, is_public, created_at, owner_id'

const DETAIL_COLUMNS = `*, recipe_ingredients(position, text), recipe_steps(position, title, body, tip)`

/**
 * Receitas visíveis para quem está pedindo. A RLS de `recipes` já resolve o
 * recorte (`is_public = true OR owner_id = auth.uid()`), então não há filtro
 * de visibilidade aqui — sem sessão, sobram só as públicas.
 */
export async function fetchRecipes(filters: { category?: string; q?: string } = {}): Promise<Recipe[]> {
  const supabase = createSupabaseServerClient()

  let query = supabase
    .from('recipes')
    .select(`${LIST_COLUMNS}, recipe_ingredients(position, text), recipe_steps(position, title, body, tip)`)
    .order('created_at', { ascending: false })
    .limit(50)

  if (filters.category) query = query.eq('category', filters.category)
  if (filters.q) query = query.ilike('name', `%${filters.q}%`)

  const { data, error } = await query
  if (error) throw error

  return (data ?? []).map(normalizeRecipe)
}

export async function fetchRecipe(id: string): Promise<Recipe | null> {
  const supabase = createSupabaseServerClient()

  const { data, error } = await supabase
    .from('recipes')
    .select(DETAIL_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return null
  return normalizeRecipe(data)
}

export async function fetchCategories(): Promise<Category[]> {
  const supabase = createSupabaseServerClient()

  const { data, error } = await supabase.from('recipes').select('category')
  if (error) throw error

  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    counts[row.category] = (counts[row.category] ?? 0) + 1
  }

  return CATEGORIES.map(category => ({ ...category, count: counts[category.name] ?? 0 }))
}

/** Ids favoritados pelo usuário logado — hidrata o estado inicial dos cards. */
export async function fetchFavoriteIds(): Promise<string[]> {
  const supabase = createSupabaseServerClient()

  const { data, error } = await supabase.from('favorites').select('recipe_id')
  if (error) return []

  return (data ?? []).map(row => row.recipe_id as string)
}

export async function fetchFavorites(): Promise<Recipe[]> {
  const favoriteIds = await fetchFavoriteIds()
  if (favoriteIds.length === 0) return []

  const supabase = createSupabaseServerClient()

  const { data, error } = await supabase
    .from('recipes')
    .select(LIST_COLUMNS)
    .in('id', favoriteIds)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error

  return (data ?? []).map(normalizeRecipe)
}

export async function fetchProfile(): Promise<Profile | null> {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [{ data: profile }, { count: recipesCount }, { count: favoritesCount }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('recipes').select('id', { count: 'exact', head: true }).eq('owner_id', user.id),
    supabase.from('favorites').select('recipe_id', { count: 'exact', head: true }).eq('user_id', user.id),
  ])

  if (!profile) return null

  return {
    ...profile,
    stats: {
      recipes_created: recipesCount ?? 0,
      favorites: favoritesCount ?? 0,
    },
  }
}

function normalizeRecipe(row: Record<string, unknown>): Recipe {
  const rawIngredients = (row.recipe_ingredients as Array<{ position: number; text: string }> | null) ?? []
  const rawSteps = (row.recipe_steps as Array<{ position: number; title: string; body: string; tip?: string }> | null) ?? []

  const ingredients = [...rawIngredients]
    .sort((a, b) => a.position - b.position)
    .map(i => i.text)

  const steps = [...rawSteps]
    .sort((a, b) => a.position - b.position)
    .map(s => ({ title: s.title, body: s.body, ...(s.tip ? { tip: s.tip } : {}) }))

  const rest = { ...row }
  delete rest.recipe_ingredients
  delete rest.recipe_steps

  return { ...(rest as Omit<Recipe, 'ingredients' | 'steps'>), ingredients, steps }
}
