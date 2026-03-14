import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { emisor } from '../db/schema'
import { eq } from 'drizzle-orm' 
import type { D1Database } from '@cloudflare/workers-types'

// Definición del JWT Payload
type Variables = {
  jwtPayload: {
    id: number
    username: string
    email: string
  }
}

export const emisores = new Hono<{ 
  Bindings: { isabel_db: D1Database },
  Variables: Variables 
}>()

// --- REGISTRAR EMISOR ---
emisores.post('/', async (c) => {
  const db = drizzle(c.env.isabel_db)
  const body = await c.req.json()
  
  // Extraemos el ID del payload (que viene del token JWT)
  const payload = c.get('jwtPayload')
  const currentUserId = payload.id

  try {
    const result = await db.insert(emisor).values({
      rfc: body.rfc,
      razonSocial: body.razonSocial,
      regimenFiscal: body.regimenFiscal,
      LugarExpedicion: body.LugarExpedicion,
      userId: currentUserId, 
    }).returning()

    return c.json({ success: true, data: result[0] }, 201)
  } catch (e) {
    console.error(e)
    return c.json({ success: false, error: 'Error al registrar emisor' }, 400)
  }
})

// --- OBTENER EMISORES ---
emisores.get('/', async (c) => {
  const db = drizzle(c.env.isabel_db)
  const payload = c.get('jwtPayload')

  try {
    const misEmisores = await db.select()
      .from(emisor)
      .where(eq(emisor.userId, payload.id)) // <-- Filtro de seguridad (userId)

    return c.json({ success: true, data: misEmisores })
  } catch (e) {
    return c.json({ success: false, error: 'Error al obtener emisores' }, 500)
  }
})

export default emisores