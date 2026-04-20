import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { users } from './users';

export const emisor = sqliteTable('emisor', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  rfc: text('rfc').notNull(),
  razonSocial: text('razon_social').notNull(),
  regimenFiscal: text('regimen_fiscal').notNull(),
  LugarExpedicion: text('Lugar_Expedicion').notNull(),
  cerFileKey: text('cer_file_key'),
  keyFileKey: text('key_file_key'),
  csdPasswordCifrada: text('csd_password_cifrada'),
  fechaVencimientoCsd: integer('fecha_vencimiento_csd', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});
