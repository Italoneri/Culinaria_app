import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { HTTPException } from 'hono/http-exception'
import { adminClient } from '../lib/supabase'
import type { AuthVariables } from '../middleware/auth'

const presignSchema = z.object({
  type: z.enum(['recipe', 'avatar']),
  id: z.string().uuid(),
})

export const uploadRouter = new Hono<{ Variables: AuthVariables }>()

uploadRouter.post('/presign', zValidator('json', presignSchema), async (c) => {
  const body = c.req.valid('json')
  const supabase = adminClient()

  const path = body.type === 'recipe'
    ? `recipes/${body.id}.jpg`
    : `avatars/${body.id}.jpg`

  const { data, error } = await supabase.storage
    .from('saveur-images')
    .createSignedUploadUrl(path)

  if (error) throw new HTTPException(500, { message: error.message })

  const publicUrl = supabase.storage
    .from('saveur-images')
    .getPublicUrl(path).data.publicUrl

  return c.json({
    data: {
      upload_url: data.signedUrl,
      public_url: publicUrl,
      path,
    },
  })
})
