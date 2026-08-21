'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createSupabaseServerClient } from './supabase-server'
import { RECIPE_CATEGORIES, DIFFICULTIES, IMAGE_BUCKET } from './data'

const difficultySchema = z.enum(DIFFICULTIES)
const categorySchema = z.enum(RECIPE_CATEGORIES)

const createRecipeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(120),
  category: categorySchema,
  time_min: z.number().int().positive(),
  difficulty: difficultySchema,
  portions: z.number().int().positive(),
  calories: z.number().int().positive().optional(),
  description: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
  img_url: z.string().url().optional(),
  is_public: z.boolean().default(false),
  ingredients: z.array(z.string().min(1)).min(1),
  steps: z.array(z.object({
    title: z.string().min(1),
    body: z.string().min(1),
    tip: z.string().optional(),
  })).min(1),
})

const updateProfileSchema = z.object({
  username: z.string().min(1).max(60).optional(),
  bio: z.string().max(300).optional(),
  avatar_url: z.string().url().optional(),
})

export type CreateRecipeInput = z.input<typeof createRecipeSchema>
export type UpdateProfileInput = z.input<typeof updateProfileSchema>

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string }

const UNAUTHENTICATED = 'Sessão expirada. Entre novamente.'
const INVALID_IMAGE = 'Imagem inválida: só são aceitas imagens enviadas pelo próprio app.'

const STORAGE_PUBLIC_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/`

/**
 * A URL da imagem chega pronta do client, então precisa ser confinada ao bucket
 * e à pasta do próprio usuário — sem isso qualquer URL externa seria persistida
 * e servida como se fosse a foto da receita. `new URL` normaliza `..`, então
 * travessia de path não escapa do prefixo esperado.
 */
function isOwnStorageUrl(candidate: string, userId: string): boolean {
  try {
    const parsed = new URL(candidate)
    const expected = new URL(`${STORAGE_PUBLIC_BASE}${userId}/`)
    return parsed.origin === expected.origin && parsed.pathname.startsWith(expected.pathname)
  } catch {
    return false
  }
}

/**
 * Cria a receita e suas linhas filhas. O `id` vem pronto do client para que a
 * foto já possa ter sido enviada ao Storage sob esse id antes do insert.
 */
export async function createRecipe(input: CreateRecipeInput): Promise<ActionResult<string>> {
  const parsed = createRecipeSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'Dados da receita inválidos' }
  }

  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: UNAUTHENTICATED }

  const { ingredients, steps, ...recipe } = parsed.data

  if (recipe.img_url && !isOwnStorageUrl(recipe.img_url, user.id)) {
    return { ok: false, error: INVALID_IMAGE }
  }

  const { error: recipeError } = await supabase
    .from('recipes')
    .insert({ ...recipe, owner_id: user.id })

  if (recipeError) return { ok: false, error: recipeError.message }

  const [{ error: ingredientsError }, { error: stepsError }] = await Promise.all([
    supabase.from('recipe_ingredients').insert(
      ingredients.map((text, position) => ({ recipe_id: recipe.id, position, text }))
    ),
    supabase.from('recipe_steps').insert(
      steps.map((step, position) => ({
        recipe_id: recipe.id,
        position,
        title: step.title,
        body: step.body,
        tip: step.tip ?? null,
      }))
    ),
  ])

  if (ingredientsError || stepsError) {
    // A receita sem ingredientes nem passos é lixo — desfaz para não deixar meia-receita
    await supabase.from('recipes').delete().eq('id', recipe.id)
    return { ok: false, error: (ingredientsError ?? stepsError)!.message }
  }

  revalidatePath('/')
  revalidatePath('/receitas')
  revalidatePath('/perfil')

  return { ok: true, data: recipe.id }
}

export async function toggleFavorite(recipeId: string, favorited: boolean): Promise<ActionResult> {
  if (!z.string().uuid().safeParse(recipeId).success) {
    return { ok: false, error: 'Receita inválida' }
  }

  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: UNAUTHENTICATED }

  const { error } = favorited
    ? await supabase.from('favorites').upsert({ user_id: user.id, recipe_id: recipeId })
    : await supabase.from('favorites').delete().eq('user_id', user.id).eq('recipe_id', recipeId)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/')
  revalidatePath('/receitas')
  revalidatePath('/perfil')

  return { ok: true, data: undefined }
}

export async function updateProfile(input: UpdateProfileInput): Promise<ActionResult> {
  const parsed = updateProfileSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'Dados do perfil inválidos' }
  }

  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: UNAUTHENTICATED }

  if (parsed.data.avatar_url && !isOwnStorageUrl(parsed.data.avatar_url, user.id)) {
    return { ok: false, error: INVALID_IMAGE }
  }

  const { error } = await supabase
    .from('profiles')
    .update(parsed.data)
    .eq('id', user.id)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/perfil')

  return { ok: true, data: undefined }
}
