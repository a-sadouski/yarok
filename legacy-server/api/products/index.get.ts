import { eq, inArray } from 'drizzle-orm';
import { useDb } from '#server/utils/db';
import { products, productImages, productVariants } from '#server/db/schema/products';

export default defineEventHandler(async () => {
  const db = useDb();
  const config = useRuntimeConfig();

  const productRows = await db
    .select({
      id: products.id,
      categoryId: products.categoryId,
      name: products.name,
      slug: products.slug,
      description: products.description,
      isVariable: products.isVariable,
      isActive: products.isActive,
      createdAt: products.createdAt,
    })
    .from(products)
    .where(eq(products.isActive, true));

  if (!productRows.length) {
    return [];
  }

  const productIds = productRows.map(item => item.id);

  const imageRows = await db
    .select({
      id: productImages.id,
      productId: productImages.productId,
      imagePath: productImages.imagePath,
      sortOrder: productImages.sortOrder,
    })
    .from(productImages)
    .where(inArray(productImages.productId, productIds));

  const variantRows = await db
    .select({
      id: productVariants.id,
      productId: productVariants.productId,
      colorId: productVariants.colorId,
      price: productVariants.price,
      oldPrice: productVariants.oldPrice,
      sku: productVariants.sku,
      inStock: productVariants.inStock,
      isActive: productVariants.isActive,
    })
    .from(productVariants)
    .where(inArray(productVariants.productId, productIds));

  return productRows.map(product => {
    const productImageRows = imageRows
      .filter(image => image.productId === product.id)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

    const mainImage = productImageRows[0] || null;

    const variants = variantRows.filter(variant => variant.productId === product.id);

    return {
      ...product,
      imagePath: mainImage?.imagePath || null,
      previewImage: mainImage?.imagePath
        ? `${config.public.supabaseUrl}/storage/v1/object/public/products-images/${mainImage.imagePath}`
        : null,
      variants,
    };
  });
});
