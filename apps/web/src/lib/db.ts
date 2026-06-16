import { supabase } from './supabase'
import type { Recipe, Category } from './data'

const CATEGORY_EMOJIS: Record<string, string> = {
  'Café da manhã': '☕',
  'Almoço': '🍝',
  'Jantar': '🍷',
  'Sobremesa': '🍰',
  'Snacks': '🥑',
}

export async function fetchPublicRecipes(filters: { category?: string; q?: string } = {}): Promise<Recipe[]> {
  let query = supabase
    .from('recipes')
    .select(`
      id, name, category, time_min, difficulty, portions, calories,
      img_url, description, is_public, created_at,
      recipe_ingredients(position, text),
      recipe_steps(position, title, body, tip)
    `)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(50)

  if (filters.category) query = query.eq('category', filters.category)
  if (filters.q) query = query.ilike('name', `%${filters.q}%`)

  const { data, error } = await query
  if (error) throw error

  return (data ?? []).map(normalizeRecipe)
}

export async function fetchPublicRecipe(id: string): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      recipe_ingredients(position, text),
      recipe_steps(position, title, body, tip)
    `)
    .eq('id', id)
    .eq('is_public', true)
    .single()

  if (error) return null
  return normalizeRecipe(data)
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('category')
    .eq('is_public', true)

  if (error) throw error

  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    counts[row.category] = (counts[row.category] ?? 0) + 1
  }

  return Object.entries(CATEGORY_EMOJIS).map(([name, emoji]) => ({
    name,
    emoji,
    count: counts[name] ?? 0,
  }))
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

  const { recipe_ingredients: _ri, recipe_steps: _rs, ...rest } = row as Record<string, unknown>
  return { ...(rest as Omit<Recipe, 'ingredients' | 'steps'>), ingredients, steps }
}
