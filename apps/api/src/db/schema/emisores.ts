import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './users';

export const emisor = sqliteTable('emisor', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  rfc: text('rfc').notNull(),
  razonSocial: text('razon_social').notNull(),
  regimenFiscal: text('regimen_fiscal').notNull(),
  LugarExpedicion: text('Lugar_Expedicion').notNull(),
});
