import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema/products';

let _db: ReturnType<typeof drizzle> | null = null;

export const useDb = () => {
  if (_db) {
    return _db;
  }

  const config = useRuntimeConfig();
  const client = postgres(config.databaseUrl, {
    prepare: false,
  });

  console.log('DB URL:', config.databaseUrl);

  _db = drizzle(client, { schema });
  return _db;
};
