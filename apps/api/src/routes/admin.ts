import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { seedCatalogos } from '../db/seed';

const admin = new Hono<{ Bindings: { isabel_db: D1Database } }>();

admin.get('/seed', async (c) => {
  const db = drizzle(c.env.isabel_db);
  await seedCatalogos(db);
  return c.json({ success: true, message: "Base de datos poblada" });
});

export default admin;