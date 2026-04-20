import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { catUsoCFDI } from '../db/schema/catalogos';

const catalogos = new Hono<{ Bindings: { isabel_db: D1Database } }>();

catalogos.get('/uso-cfdi', async (c) => {
  const db = drizzle(c.env.isabel_db);
  const result = await db.select().from(catUsoCFDI).all();
  return c.json(result);
});

export default catalogos;