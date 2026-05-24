import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import { createClient } from '@supabase/supabase-js'

export type AuthVariables = {
  userId: string
  accessToken: string
}

export const authMiddleware = createMiddleware<{ Variables: AuthVariables }>(
  async (c, next) => {
    const authorization = c.req.header('Authorization')
    if (!authorization?.startsWith('Bearer ')) {
      throw new HTTPException(401, { message: 'Missing Bearer token' })
    }

    const token = authorization.slice(7)
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
    )

    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data.user) {
      throw new HTTPException(401, { message: 'Invalid or expired token' })
    }

    c.set('userId', data.user.id)
    c.set('accessToken', token)
    await next()
  },
)
