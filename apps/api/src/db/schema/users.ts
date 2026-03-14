// apps/api/src/db/schema/users.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nombreCompleto: text('nombre_completo').notNull(),
  username: text('username').notNull().unique(), 
  email: text('email').notNull().unique(), 
  password: text('password').notNull(), 
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});