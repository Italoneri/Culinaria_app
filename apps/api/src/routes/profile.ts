import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { HTTPException } from 'hono/http-exception'
import { userClient, adminClient } from '../lib/supabase'
import type { AuthVariables } from '../middleware/auth'

const updateProfileSchema = z.object({
  username: z.string().min(1).max(60).optional(),
  bio: z.string().max(300).optional(),
})

const createCollectionSchema = z.object({
  name: z.string().min(1).max(60),
  emoji: z.string().default('📚'),
})

export const profileRouter = new Hono<{ Variables: AuthVariables }>()

profileRouter.get('/', async (c) => {
  const userId = c.get('userId')
  const token = c.get('accessToken')
  const supabase = userClient(token)

  const [{ data: profile, error: profileErr }, { count: recipesCount }, { count: favCount }] =
    await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('recipes').select('id', { count: 'exact', head: true }).eq('owner_id', userId),
      supabase.from('favorites').select('recipe_id', { count: 'exact', head: true }).eq('user_id', userId),
    ])

  if (profileErr) throw new HTTPException(404, { message: 'Profile not found' })

  return c.json({
    data: {
      ...profile,
      stats: {
        recipes_created: recipesCount ?? 0,
        favorites: favCount ?? 0,
      },
    },
  })
})

profileRouter.put('/', zValidator('json', updateProfileSchema), async (c) => {
  const userId = c.get('userId')
  const token = c.get('accessToken')
  const body = c.req.valid('json')
  const supabase = userClient(token)

  const { data, error } = await supabase
    .from('profiles')
    .update(body)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw new HTTPException(500, { message: error.message })

  return c.json({ data })
})

// Collections

profileRouter.get('/collections', async (c) => {
  const userId = c.get('userId')
  const token = c.get('accessToken')
  const supabase = userClient(token)

  const { data, error } = await supabase
    .from('collections')
    .select(`id, name, emoji, collection_recipes(count)`)
    .eq('owner_id', userId)

  if (error) throw new HTTPException(500, { message: error.message })

  const collections = (data ?? []).map((c: any) => ({
    id: c.id,
    name: c.name,
    emoji: c.emoji,
    recipe_count: c.collection_recipes?.[0]?.count ?? 0,
  }))

  return c.json({ data: collections })
})

profileRouter.post('/collections', zValidator('json', createCollectionSchema), async (c) => {
  const userId = c.get('userId')
  const token = c.get('accessToken')
  const body = c.req.valid('json')
  const supabase = userClient(token)

  const { data, error } = await supabase
    .from('collections')
    .insert({ ...body, owner_id: userId })
    .select()
    .single()

  if (error) throw new HTTPException(500, { message: error.message })

  return c.json({ data: { ...data, recipe_count: 0 } }, 201)
})
