import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { userClient } from '../lib/supabase'
import type { AuthVariables } from '../middleware/auth'

export const favoritesRouter = new Hono<{ Variables: AuthVariables }>()

favoritesRouter.get('/', async (c) => {
  const userId = c.get('userId')
  const token = c.get('accessToken')
  const supabase = userClient(token)

  const limit = Math.min(Number(c.req.query('limit') ?? 20), 100)
  const offset = Number(c.req.query('offset') ?? 0)

  const { data, error } = await supabase
    .from('favorites')
    .select(`
      recipe_id,
      recipes(id, name, category, time_min, difficulty, portions, calories, img_url, description, is_public, created_at)
    `)
    .eq('user_id', userId)
    .range(offset, offset + limit - 1)

  if (error) throw new HTTPException(500, { message: error.message })

  const recipes = (data ?? []).map((row: any) => row.recipes).filter(Boolean)

  return c.json({ data: recipes })
})
