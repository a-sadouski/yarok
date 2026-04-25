import type { ProductItem } from '~/types';

export function getProductImage(product: ProductItem): string {
  return product.previewImage || '/images/ProductItem-product.jpg';
}

export function getProductMinPrice(product: ProductItem): number | null {
  if (!product.variants?.length) {
    return null;
  }

  const prices = product.variants
    .filter(variant => variant.isActive)
    .map(variant => Number(variant.price))
    .filter((price: number) => !Number.isNaN(price));

  if (!prices.length) {
    return null;
  }

  return Math.min(...prices);
}

export function getProductOldMinPrice(product: ProductItem): number | null {
  if (!product.variants?.length) {
    return null;
  }

  const prices = product.variants
    .filter(variant => variant.isActive && variant.oldPrice !== null)
    .map(variant => Number(variant.oldPrice))
    .filter((price: number) => !Number.isNaN(price));

  if (!prices.length) {
    return null;
  }

  return Math.min(...prices);
}

export function formatCatalogPrice(price: number | null, unit = 'BYN'): string {
  if (price === null) return 'Цена по запросу';
  return `от ${price} ${unit}`;
}
