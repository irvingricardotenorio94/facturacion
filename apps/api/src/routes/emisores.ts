import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { emisor } from '../db/schema'
import { eq } from 'drizzle-orm' 
import type { D1Database, R2Bucket } from '@cloudflare/workers-types'
import { CryptoService } from '../services/crypto' 

type Variables = {
  jwtPayload: { id: number; username: string; email: string }
}

export const emisores = new Hono<{ 
  Bindings: { isabel_db: D1Database, CSD_BUCKET: R2Bucket, ENCRYPTION_KEY: string },
  Variables: Variables 
}>()

// --- REGISTRO EMISOR ---
emisores.post('/', async (c) => {
  const db = drizzle(c.env.isabel_db)
  const body = await c.req.json<{ rfc: string, razonSocial: string, regimenFiscal: string, LugarExpedicion: string }>()
  const payload = c.get('jwtPayload')

  try {
    const result = await db.insert(emisor).values({
      rfc: body.rfc,
      razonSocial: body.razonSocial,
      regimenFiscal: body.regimenFiscal,
      LugarExpedicion: body.LugarExpedicion,
      userId: payload.id, 
    }).returning()
    return c.json({ success: true, data: result[0] }, 201)
  } catch (e) {
    return c.json({ success: false, error: 'Error al registrar emisor' }, 400)
  }
})

// --- ACTUALIZAR CSD ---
emisores.post('/configurar-csd', async (c) => {
  const db = drizzle(c.env.isabel_db)
  const payload = c.get('jwtPayload')
  const formData = await c.req.formData()
  
  const cerEntry = formData.get('cer') as unknown
  const keyEntry = formData.get('key') as unknown
  const password = formData.get('password')

  if (!(cerEntry instanceof File) || !(keyEntry instanceof File) || typeof password !== 'string') {
    return c.json({ success: false, error: 'Archivos o contraseña inválidos' }, 400)
  }

  try {
    const passCifrada = await CryptoService.encrypt(password, c.env.ENCRYPTION_KEY)
    const emisorActual = await db.select().from(emisor).where(eq(emisor.userId, payload.id)).get()

    if (!emisorActual) {
      return c.json({ success: false, error: 'Registro fiscal no encontrado' }, 404)
    }

    const timestamp = Date.now()
    const cerPath = `csds/${emisorActual.rfc}_${timestamp}.cer`
    const keyPath = `csds/${emisorActual.rfc}_${timestamp}.key`

    await c.env.CSD_BUCKET.put(cerPath, await cerEntry.arrayBuffer())
    await c.env.CSD_BUCKET.put(keyPath, await keyEntry.arrayBuffer())

    await db.update(emisor)
      .set({
        cerFileKey: cerPath,
        keyFileKey: keyPath,
        csdPasswordCifrada: passCifrada,
        updatedAt: new Date()
      })
      .where(eq(emisor.userId, payload.id))

    return c.json({ success: true, message: 'CSD actualizado' })
  } catch (e) {
    return c.json({ success: false, error: 'Error en procesamiento' }, 500)
  }
})

// --- OBTENER EMISOR ---
emisores.get('/', async (c) => {
  const db = drizzle(c.env.isabel_db)
  const payload = c.get('jwtPayload')
  try {
    const misEmisores = await db.select().from(emisor).where(eq(emisor.userId, payload.id))
    return c.json({ success: true, data: misEmisores })
  } catch (e) {
    return c.json({ success: false, error: 'Error al obtener emisores' }, 500)
  }
})

export default emisores