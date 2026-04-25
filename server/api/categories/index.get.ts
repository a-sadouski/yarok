import { asc } from 'drizzle-orm';
import { useDb } from '#server/utils/db';
import { categories } from '#server/db/schema/products';

export default defineEventHandler(async () => {
  const db = useDb();

  return await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
    })
    .from(categories)
    .orderBy(asc(categories.id));
});
