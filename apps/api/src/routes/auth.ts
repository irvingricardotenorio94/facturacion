import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm' 
import { sign } from 'hono/jwt' 
import type { D1Database } from '@cloudflare/workers-types'

const getErrorDetails = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  const cause =
    error && typeof error === 'object' && 'cause' in error
      ? String((error as { cause?: unknown }).cause)
      : undefined

  return { message, cause }
}

// Agregamos JWT_SECRET a los Bindings
const auth = new Hono<{ 
  Bindings: { 
    isabel_db: D1Database,
    JWT_SECRET: string 
  } 
}>()

// --- ENDPOINT DE REGISTRO ---
auth.post('/register', async (c) => {
  const db = drizzle(c.env.isabel_db)
  const body = await c.req.json()

  try {
    if (!body?.nombreCompleto || !body?.username || !body?.email || !body?.password) {
      return c.json(
        { success: false, error: 'Faltan campos requeridos: nombreCompleto, username, email, password' },
        400
      )
    }

    const msgUint8 = new TextEncoder().encode(body.password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    const result = await db.insert(users).values({
      nombreCompleto: body.nombreCompleto,
      username: body.username,
      email: body.email,
      password: hashedPassword,
    }).returning()

    return c.json({ success: true, userId: result[0].id }, 201)
  } catch (e) {
    const { message, cause } = getErrorDetails(e)
    console.error('Auth register error:', { message, cause })
    return c.json({ success: false, error: message, cause }, 500)
  }
})

// --- ENDPOINT DE LOGIN (Ajustado por Username) ---
auth.post('/login', async (c) => {
  const db = drizzle(c.env.isabel_db)
  const body = await c.req.json()
  
  // Ahora extraemos 'username' en lugar de 'email'
  const { username, password } = body

  try {
    if (!username || !password) {
      return c.json({ success: false, error: 'username y password son requeridos' }, 400)
    }

    // 1. Hashear la contraseña recibida para comparar
    const msgUint8 = new TextEncoder().encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // 2. Buscar al usuario por USERNAME
    const user = await db.select().from(users)
      .where(eq(users.username, username))
      .get()

    // 3. Validar credenciales
    if (!user || user.password !== hashedPassword) {
      return c.json({ success: false, error: 'Credenciales inválidas' }, 401)
    }

    // 4. Generar el Token JWT
    const payload = {
      id: user.id,
      username: user.username, // Incluimos username en el payload
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8, // 8 horas
    }
    
    const token = await sign(payload, c.env.JWT_SECRET)

    return c.json({
      success: true,
      token,
      user: { 
        id: user.id, 
        nombre: user.nombreCompleto,
        username: user.username 
      }
    })

  } catch (e) {
    const { message, cause } = getErrorDetails(e)
    console.error('Auth login error:', { message, cause })
    return c.json({ success: false, error: message, cause }, 500)
  }
})

export default auth