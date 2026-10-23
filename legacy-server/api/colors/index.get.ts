import { asc } from 'drizzle-orm';
import { useDb } from '#server/utils/db';
import { colors } from '#server/db/schema/products';

export default defineEventHandler(async () => {
  const db = useDb();

  return await db
    .select({
      id: colors.id,
      name: colors.name,
      slug: colors.slug,
      hex: colors.hex,
    })
    .from(colors)
    .orderBy(asc(colors.id));
});
