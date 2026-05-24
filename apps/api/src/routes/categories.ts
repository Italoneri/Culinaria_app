import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { userClient } from '../lib/supabase'
import type { AuthVariables } from '../middleware/auth'

const CATEGORY_EMOJIS: Record<string, string> = {
  'Café da manhã': '☕',
  'Almoço': '🍝',
  'Jantar': '🍷',
  'Sobremesa': '🍰',
  'Snacks': '🥑',
}

export const categoriesRouter = new Hono<{ Variables: AuthVariables }>()

categoriesRouter.get('/', async (c) => {
  const token = c.get('accessToken')
  const supabase = userClient(token)

  const { data, error } = await supabase
    .from('recipes')
    .select('category')
    .eq('is_public', true)

  if (error) throw new HTTPException(500, { message: error.message })

  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    counts[row.category] = (counts[row.category] ?? 0) + 1
  }

  const categories = Object.entries(CATEGORY_EMOJIS).map(([name, emoji]) => ({
    name,
    emoji,
    count: counts[name] ?? 0,
  }))

  return c.json({ data: categories })
})
