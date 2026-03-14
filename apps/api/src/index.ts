import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { cors } from 'hono/cors' // 1. Importamos el middleware de CORS
import auth from './routes/auth'
import emisores from './routes/emisores'
import clientes from './routes/receptores'
import type { D1Database } from '@cloudflare/workers-types'

// los tipos globales para el entorno (Bindings)
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

// Rutas Públicas
app.route('/auth', auth)

// Middleware de JWT para rutas protegidas
app.use('/api/*', async (c, next) => {
  const authMiddleware = jwt({
    secret: c.env.JWT_SECRET,
    alg: 'HS256',
  })
  return authMiddleware(c, next)
})

// Rutas Protegidas
app.route('/api/emisores', emisores)
app.route('/api/receptores', clientes)

app.get('/', (c) => c.text('Isabel API is running!'))

export default app