import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { cors } from 'hono/cors'
import { apiRoutes } from './routes'
import type { D1Database } from '@cloudflare/workers-types'

type Bindings = {
  isabel_db: D1Database
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors({
  origin: 'http://localhost:3000', 
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}))

app.route('/auth', apiRoutes.auth)

app.use('/api/*', async (c, next) => {
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

export default app