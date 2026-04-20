import { DrizzleD1Database } from 'drizzle-orm/d1';
import { catUsoCFDI } from './schema/catalogos';
import usoCfdiData from '../data/usoCfdi.json';

interface UsoCfdiItem {
  id: string;
  descripcion: string;
  fisica: boolean;
  moral: boolean;
  regimenes: string[];
}

export async function seedCatalogos(db: DrizzleD1Database<Record<string, unknown>>) {
  const data = usoCfdiData as UsoCfdiItem[];

  for (const item of data) {
    await db.insert(catUsoCFDI).values({
      id: item.id,
      descripcion: item.descripcion,
      fisica: item.fisica ? 1 : 0,
      moral: item.moral ? 1 : 0,
      regimenesPermitidos: item.regimenes.join(','),
    }).onConflictDoUpdate({
      target: catUsoCFDI.id,
      set: { 
        descripcion: item.descripcion,
        fisica: item.fisica ? 1 : 0,
        moral: item.moral ? 1 : 0,
        regimenesPermitidos: item.regimenes.join(','),
      }
    });
  }
}