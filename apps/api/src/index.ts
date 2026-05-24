import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { HTTPException } from 'hono/http-exception'
import { authMiddleware } from './middleware/auth'
import { recipesRouter } from './routes/recipes'
import { categoriesRouter } from './routes/categories'
import { favoritesRouter } from './routes/favorites'
import { profileRouter } from './routes/profile'
import { uploadRouter } from './routes/upload'

const app = new Hono()

app.use('*', logger())
app.use('*', cors({ origin: process.env.FRONTEND_URL ?? '*' }))

app.get('/health', (c) => c.json({ status: 'ok' }))

// All /api routes require auth
const api = app.basePath('/api')
api.use('*', authMiddleware)

api.route('/recipes', recipesRouter)
api.route('/categories', categoriesRouter)
api.route('/favorites', favoritesRouter)
api.route('/profile', profileRouter)
api.route('/upload', uploadRouter)

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message, status: err.status }, err.status)
  }
  console.error(err)
  return c.json({ error: 'Internal server error', status: 500 }, 500)
})

export default {
  port: Number(process.env.PORT ?? 3001),
  fetch: app.fetch,
}
