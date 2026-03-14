import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { receptores } from '../db/schema'
import { eq } from 'drizzle-orm' // Importante para filtrar por usuario
import type { D1Database } from '@cloudflare/workers-types'

// Definición del JWT Payload para que TypeScript no se queje
type Variables = {
  jwtPayload: {
    id: number
    username: string
    email: string
  }
}

const clientes = new Hono<{ 
  Bindings: { isabel_db: D1Database },
  Variables: Variables 
}>()

// --- REGISTRAR RECEPTOR (Vinculado al usuario) ---
clientes.post('/', async (c) => {
  const db = drizzle(c.env.isabel_db)
  const body = await c.req.json()
  
  // Extraemos tu ID del Token JWT
  const payload = c.get('jwtPayload')
  const currentUserId = payload.id

  try {
    const result = await db.insert(receptores).values({
      rfc: body.rfc,
      razonSocial: body.razonSocial,
      regimenFiscal: body.regimenFiscal,
      DomicilioFiscalReceptor: body.DomicilioFiscalReceptor,
      usoCfdi: body.usoCfdi,
      email: body.email,
      userId: currentUserId,
    }).returning()

    return c.json({ success: true, data: result[0] }, 201)
  } catch (e) {
    console.error(e)
    return c.json({ success: false, error: 'Error al registrar receptor' }, 400)
  }
})

// --- OBTENER RECEPTORES ---
clientes.get('/', async (c) => {
  const db = drizzle(c.env.isabel_db)
  const payload = c.get('jwtPayload')

  try {
    const misReceptores = await db.select()
      .from(receptores)
      .where(eq(receptores.userId, payload.id)) // 

    return c.json({ success: true, data: misReceptores })
  } catch (e) {
    return c.json({ success: false, error: 'Error al obtener receptores' }, 500)
  }
})

export default clientes