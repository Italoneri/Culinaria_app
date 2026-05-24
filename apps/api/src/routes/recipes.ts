import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { HTTPException } from 'hono/http-exception'
import { userClient } from '../lib/supabase'
import type { AuthVariables } from '../middleware/auth'

const difficultySchema = z.enum(['Fácil', 'Médio', 'Difícil'])
const categorySchema = z.enum(['Café da manhã', 'Almoço', 'Jantar', 'Sobremesa', 'Snacks'])

const stepSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  tip: z.string().optional(),
})

const createRecipeSchema = z.object({
  name: z.string().min(1).max(120),
  category: categorySchema,
  time_min: z.number().int().positive(),
  difficulty: difficultySchema,
  portions: z.number().int().positive(),
  calories: z.number().int().positive().optional(),
  description: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
  is_public: z.boolean().default(false),
  ingredients: z.array(z.string().min(1)).min(1),
  steps: z.array(stepSchema).min(1),
})

const updateRecipeSchema = createRecipeSchema.partial()

export const recipesRouter = new Hono<{ Variables: AuthVariables }>()

recipesRouter.get('/', async (c) => {
  const userId = c.get('userId')
  const token = c.get('accessToken')
  const supabase = userClient(token)

  const search = c.req.query('search')
  const category = c.req.query('category')
  const limit = Math.min(Number(c.req.query('limit') ?? 20), 100)
  const offset = Number(c.req.query('offset') ?? 0)

  let query = supabase
    .from('recipes')
    .select('id, name, category, time_min, difficulty, portions, calories, img_url, description, is_public, created_at, owner_id')
    .or(`owner_id.eq.${userId},is_public.eq.true`)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category) query = query.eq('category', category)
  if (search) query = query.ilike('name', `%${search}%`)

  const { data, error } = await query
  if (error) throw new HTTPException(500, { message: error.message })

  return c.json({ data })
})

recipesRouter.post('/', zValidator('json', createRecipeSchema), async (c) => {
  const userId = c.get('userId')
  const token = c.get('accessToken')
  const body = c.req.valid('json')
  const supabase = userClient(token)

  const { ingredients, steps, ...recipeFields } = body

  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .insert({ ...recipeFields, owner_id: userId })
    .select('id')
    .single()

  if (recipeError) throw new HTTPException(500, { message: recipeError.message })

  const ingredientRows = ingredients.map((text, i) => ({
    recipe_id: recipe.id,
    position: i,
    text,
  }))

  const stepRows = steps.map((s, i) => ({
    recipe_id: recipe.id,
    position: i,
    title: s.title,
    body: s.body,
    tip: s.tip ?? null,
  }))

  const [{ error: ingErr }, { error: stepErr }] = await Promise.all([
    supabase.from('recipe_ingredients').insert(ingredientRows),
    supabase.from('recipe_steps').insert(stepRows),
  ])

  if (ingErr) throw new HTTPException(500, { message: ingErr.message })
  if (stepErr) throw new HTTPException(500, { message: stepErr.message })

  const { data: full, error: fetchErr } = await supabase
    .from('recipes')
    .select(`*, recipe_ingredients(position, text), recipe_steps(position, title, body, tip)`)
    .eq('id', recipe.id)
    .single()

  if (fetchErr) throw new HTTPException(500, { message: fetchErr.message })

  return c.json({ data: normalizeRecipe(full) }, 201)
})

recipesRouter.get('/:id', async (c) => {
  const token = c.get('accessToken')
  const supabase = userClient(token)
  const id = c.req.param('id')

  const { data, error } = await supabase
    .from('recipes')
    .select(`*, recipe_ingredients(position, text), recipe_steps(position, title, body, tip)`)
    .eq('id', id)
    .single()

  if (error) throw new HTTPException(404, { message: 'Recipe not found' })

  return c.json({ data: normalizeRecipe(data) })
})

recipesRouter.put('/:id', zValidator('json', updateRecipeSchema), async (c) => {
  const userId = c.get('userId')
  const token = c.get('accessToken')
  const body = c.req.valid('json')
  const id = c.req.param('id')
  const supabase = userClient(token)

  const { ingredients, steps, ...recipeFields } = body

  if (Object.keys(recipeFields).length > 0) {
    const { error } = await supabase
      .from('recipes')
      .update({ ...recipeFields, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('owner_id', userId)

    if (error) throw new HTTPException(500, { message: error.message })
  }

  if (ingredients) {
    await supabase.from('recipe_ingredients').delete().eq('recipe_id', id)
    await supabase.from('recipe_ingredients').insert(
      ingredients.map((text, i) => ({ recipe_id: id, position: i, text }))
    )
  }

  if (steps) {
    await supabase.from('recipe_steps').delete().eq('recipe_id', id)
    await supabase.from('recipe_steps').insert(
      steps.map((s, i) => ({ recipe_id: id, position: i, title: s.title, body: s.body, tip: s.tip ?? null }))
    )
  }

  const { data, error } = await supabase
    .from('recipes')
    .select(`*, recipe_ingredients(position, text), recipe_steps(position, title, body, tip)`)
    .eq('id', id)
    .single()

  if (error) throw new HTTPException(404, { message: 'Recipe not found' })

  return c.json({ data: normalizeRecipe(data) })
})

recipesRouter.delete('/:id', async (c) => {
  const userId = c.get('userId')
  const token = c.get('accessToken')
  const id = c.req.param('id')
  const supabase = userClient(token)

  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id)
    .eq('owner_id', userId)

  if (error) throw new HTTPException(500, { message: error.message })

  return c.json({ data: { id } })
})

recipesRouter.post('/:id/favorites', async (c) => {
  const userId = c.get('userId')
  const token = c.get('accessToken')
  const recipeId = c.req.param('id')
  const supabase = userClient(token)

  const { error } = await supabase
    .from('favorites')
    .upsert({ user_id: userId, recipe_id: recipeId })

  if (error) throw new HTTPException(500, { message: error.message })

  return c.json({ data: { recipe_id: recipeId, favorited: true } })
})

recipesRouter.delete('/:id/favorites', async (c) => {
  const userId = c.get('userId')
  const token = c.get('accessToken')
  const recipeId = c.req.param('id')
  const supabase = userClient(token)

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('recipe_id', recipeId)

  if (error) throw new HTTPException(500, { message: error.message })

  return c.json({ data: { recipe_id: recipeId, favorited: false } })
})

// Normalize DB row to API shape
function normalizeRecipe(row: any) {
  const ingredients = [...(row.recipe_ingredients ?? [])]
    .sort((a: any, b: any) => a.position - b.position)
    .map((i: any) => i.text)

  const steps = [...(row.recipe_steps ?? [])]
    .sort((a: any, b: any) => a.position - b.position)
    .map((s: any) => ({ title: s.title, body: s.body, ...(s.tip ? { tip: s.tip } : {}) }))

  const { recipe_ingredients, recipe_steps, ...rest } = row
  return { ...rest, ingredients, steps }
}
