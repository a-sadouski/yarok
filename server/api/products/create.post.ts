import { products, productVariants, productImages } from '#server/db/schema/products';
import { useDb } from '#server/utils/db';
import { useSupabaseServer } from '#server/utils/supabase';
import { and, eq, ne } from 'drizzle-orm';
import { createError } from 'h3';

type ProductVariantInput = {
  colorId: number;
  price: string;
  sku?: string;
  inStock?: boolean;
};

export default defineEventHandler(async event => {
  const parts = await readMultipartFormData(event);

  if (!hasAdminSession(event)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

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
  const categoryIdRaw = getFieldValue('categoryId');
  const isVariableRaw = getFieldValue('isVariable').trim();

  const colorIdRaw = getFieldValue('colorId').trim();
  const price = getFieldValue('price').trim();
  const sku = getFieldValue('sku').trim();
  const inStockRaw = getFieldValue('inStock').trim();

  const variantsRaw = getFieldValue('variants').trim();

  const categoryId = categoryIdRaw ? Number(categoryIdRaw) : null;
  const colorId = colorIdRaw ? Number(colorIdRaw) : null;
  const isVariable = isVariableRaw === 'true';
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
    .where(and(eq(products.slug, slug)))
    .limit(1);

  if (productWithSameSlug[0]) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Товар с таким slug уже существует',
    });
  }

  const createdProducts = await db
    .insert(products)
    .values({
      name,
      slug,
      description: description || undefined,
      categoryId,
      isVariable,
      isActive: true,
    })
    .returning();

  const createdProduct = createdProducts[0];

  if (!createdProduct) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Product was not created',
    });
  }

  if (!isVariable) {
    if (!price) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Price is required for non-variable product',
      });
    }

    if (!colorId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Color is required for non-variable product',
      });
    }

    await db.insert(productVariants).values({
      productId: createdProduct.id,
      colorId,
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

    console.log(parsedVariants.map(item => item.colorId));

    await db.insert(productVariants).values(
      parsedVariants.map(variant => ({
        productId: createdProduct.id,
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

    const imagePath = `products/${createdProduct.id}/main.${extension}`;

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

    await db.insert(productImages).values({
      productId: createdProduct.id,
      imagePath,
      sortOrder: 1,
    });
  }

  return {
    id: createdProduct.id,
    name: createdProduct.name,
    slug: createdProduct.slug,
    isVariable: createdProduct.isVariable,
    imagePath: uploadedImagePath,
  };
});
