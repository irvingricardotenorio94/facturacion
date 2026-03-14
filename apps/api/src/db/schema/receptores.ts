import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './users'; 

export const receptores = sqliteTable('receptores', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id), 
  rfc: text('rfc').notNull(),
  razonSocial: text('razon_social').notNull(),
  regimenFiscal: text('regimen_fiscal').notNull(),
  DomicilioFiscalReceptor: text('Domicilio_Fiscal_Receptor').notNull(),
  usoCfdi: text('uso_cfdi').notNull(),
  email: text('email'),
});