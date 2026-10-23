import type { ProductFormState, ProductVariant } from '../types/product';
import { slugify } from './slugify';

export function createProductPayload(
  form: ProductFormState,
  image: File | null,
  removeImage: boolean,
  originalVariants: ProductVariant[],
  grayColorId: number | null,
): FormData {
  const body = new FormData();
  for (const [key, value] of Object.entries({
    name: form.name.trim(),
    slug: slugify(form.name),
    description: form.description,
    categoryId: String(form.categoryId),
    isVariable: String(form.isVariable),
    isActive: String(form.isActive),
    removeImage: String(removeImage),
  })) {
    body.append(key, value);
  }

  if (form.isVariable) {
    body.append(
      'variants',
      JSON.stringify(
        form.variants.map(variant => {
          const original = originalVariants.find(item => item.colorId === variant.colorId);
          return {
            ...variant,
            price: String(variant.price),
            oldPrice: original?.oldPrice ?? null,
            isActive: original?.isActive ?? true,
          };
        }),
      ),
    );
  } else {
    const original = originalVariants.find(item => item.colorId === grayColorId);
    body.append('colorId', String(grayColorId ?? ''));
    body.append('price', String(form.price));
    body.append('sku', form.sku);
    body.append('inStock', String(form.inStock));
    body.append('oldPrice', original?.oldPrice ?? '');
    body.append('variantActive', String(original?.isActive ?? true));
  }
  if (image) {
    body.append('image', image);
  }
  return body;
}
