import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const catUsoCFDI = sqliteTable('cat_uso_cfdi', {
  id: text('id').primaryKey(),
  descripcion: text('descripcion').notNull(),
  fisica: integer('fisica', { mode: 'boolean' }).notNull(), 
  moral: integer('moral', { mode: 'boolean' }).notNull(),
  regimenesPermitidos: text('regimenes_permitidos').notNull(),
});
