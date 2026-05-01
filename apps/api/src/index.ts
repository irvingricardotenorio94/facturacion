import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { cors } from 'hono/cors'
import { apiRoutes } from './routes'
import type { D1Database } from '@cloudflare/workers-types'

type Bindings = {
  isabel_db: D1Database
  JWT_SECRET: string
  CORS_ORIGINS?: string
  APP_ENV?: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', async (c, next) => {
  /**
   * Cross-Origin Resource Sharing (CORS) Policy Configuration
   * Aggregates authorized origins from environment bindings
   */
  const rawOrigins = c.env.CORS_ORIGINS ?? 'http://localhost:3000,https://facturacion-bvp.pages.dev'
  const allowedOrigins = rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  const corsMiddleware = cors({
    origin: (origin) => {
      if (!origin) return allowedOrigins[0] ?? '*'
      return allowedOrigins.includes(origin) ? origin : allowedOrigins[0] ?? '*'
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })

  return corsMiddleware(c, next)
})

app.route('/auth', apiRoutes.auth)

app.use('/api/*', async (c, next) => {
  if (c.req.method === 'OPTIONS') {
    return next()
  }

  const authMiddleware = jwt({
    secret: c.env.JWT_SECRET,
    alg: 'HS256',
  })
  return authMiddleware(c, next)
})

app.route('/api/emisores', apiRoutes.emisores)
app.route('/api/receptores', apiRoutes.receptores)
app.route('/api/admin', apiRoutes.admin)
app.route('/api/catalogos', apiRoutes.catalogos)

app.get('/', (c) => c.text('Isabel API is running!'))

app.onError((err, c) => {
  console.error('Unhandled error:', err)

  const isProduction = c.env.APP_ENV === 'production'

  return c.json(
    {
      success: false,
      message: 'Internal Server Error',
      error: err instanceof Error ? err.message : String(err),
      stack: isProduction ? undefined : err instanceof Error ? err.stack : undefined,
      path: c.req.path,
      method: c.req.method,
    },
    500
  )
})

export default app