import { and, eq, ne } from 'drizzle-orm';
import { createError, getRouterParam, readMultipartFormData } from 'h3';
import { products, productVariants, productImages } from '#server/db/schema/products';
import { useDb } from '#server/utils/db';
import { useSupabaseServer } from '#server/utils/supabase';

type ProductVariantInput = {
  colorId: number;
  price: string;
  sku?: string;
  inStock?: boolean;
};

export default defineEventHandler(async event => {
  const idParam = getRouterParam(event, 'id');
  const productId = idParam ? Number(idParam) : null;

  if (!hasAdminSession(event)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  if (!productId || Number.isNaN(productId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Valid product id is required',
    });
  }

  const parts = await readMultipartFormData(event);

  if (!parts) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Form data is empty',
    });
  }

  const getFieldValue = (name: string) => {
    const part = parts.find(item => item.name === name);

    return part?.data ? Buffer.from(part.data).toString('utf-8') : '';
  };

  const imagePart = parts.find(item => item.name === 'image');

  const name = getFieldValue('name').trim();
  const slug = getFieldValue('slug').trim();
  const description = getFieldValue('description').trim();
  const categoryIdRaw = getFieldValue('categoryId').trim();
  const isVariableRaw = getFieldValue('isVariable').trim();
  const isActiveRaw = getFieldValue('isActive').trim();

  const price = getFieldValue('price').trim();
  const sku = getFieldValue('sku').trim();
  const inStockRaw = getFieldValue('inStock').trim();
  const variantsRaw = getFieldValue('variants').trim();

  const categoryId = categoryIdRaw ? Number(categoryIdRaw) : null;
  const isVariable = isVariableRaw === 'true';
  const isActive = isActiveRaw ? isActiveRaw === 'true' : true;
  const inStock = inStockRaw ? inStockRaw === 'true' : true;

  if (!name || !slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name and slug are required',
    });
  }

  if (!categoryId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category is required',
    });
  }

  const db = useDb();

  const productWithSameSlug = await db
    .select({ id: products.id })
    .from(products)
    .where(and(eq(products.slug, slug), ne(products.id, productId)))
    .limit(1);

  if (productWithSameSlug[0]) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Товар с таким slug уже существует',
    });
  }

  const existingProducts = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  const existingProduct = existingProducts[0];

  if (!existingProduct) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found',
    });
  }

  await db
    .update(products)
    .set({
      name,
      slug,
      description: description || null,
      categoryId,
      isVariable,
      isActive,
    })
    .where(eq(products.id, productId));

  await db.delete(productVariants).where(eq(productVariants.productId, productId));

  if (!isVariable) {
    if (!price) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Price is required for non-variable product',
      });
    }

    await db.insert(productVariants).values({
      productId,
      colorId: undefined,
      price,
      sku: sku || undefined,
      inStock,
      isActive: true,
    });
  } else {
    if (!variantsRaw) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Variants are required for variable product',
      });
    }

    let parsedVariants: ProductVariantInput[] = [];

    try {
      parsedVariants = JSON.parse(variantsRaw);
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: 'Variants JSON is invalid',
      });
    }

    if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Variants list is empty',
      });
    }

    await db.insert(productVariants).values(
      parsedVariants.map(variant => ({
        productId,
        colorId: variant.colorId,
        price: variant.price,
        sku: variant.sku || undefined,
        inStock: variant.inStock ?? true,
        isActive: true,
      })),
    );
  }

  let uploadedImagePath: string | null = null;

  if (imagePart?.data?.length) {
    const supabase = useSupabaseServer();

    const originalFileName = imagePart.filename || 'image.png';
    const extension = originalFileName.includes('.') ? originalFileName.split('.').pop() : 'png';

    const imagePath = `products/${productId}/main.${extension}`;

    const { error: uploadError } = await supabase.storage.from('products-images').upload(imagePath, imagePart.data, {
      contentType: imagePart.type || 'image/png',
      upsert: true,
    });

    if (uploadError) {
      throw createError({
        statusCode: 500,
        statusMessage: uploadError.message,
      });
    }

    uploadedImagePath = imagePath;

    const existingImages = await db
      .select({ id: productImages.id })
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .limit(1);

    const existingImage = existingImages[0];

    if (existingImage) {
      await db
        .update(productImages)
        .set({
          imagePath,
          sortOrder: 1,
        })
        .where(eq(productImages.id, existingImage.id));
    } else {
      await db.insert(productImages).values({
        productId,
        imagePath,
        sortOrder: 1,
      });
    }
  }

  return {
    id: productId,
    name,
    slug,
    isVariable,
    imagePath: uploadedImagePath,
  };
});
