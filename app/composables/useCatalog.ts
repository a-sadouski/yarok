import { ProductsApi } from '~/api/products.api';
import type {
  CatalogProductColorOption,
  CatalogProductMetaById,
  ProductCategory,
  ProductColor,
  ProductItem,
} from '~/types';

export async function useCatalog() {
  const { data, pending, error, refresh } = await useAsyncData('catalog-data', async () => {
    const [loadedCategories, loadedProducts, loadedColors] = await Promise.all([
      ProductsApi.getAllCategories(),
      ProductsApi.getAllProducts(),
      ProductsApi.getAllColors(),
    ]);

    return {
      categories: loadedCategories,
      products: loadedProducts,
      colors: loadedColors,
    };
  });

  const categories = computed<ProductCategory[]>(() => data.value?.categories ?? []);
  const products = computed<ProductItem[]>(() => data.value?.products ?? []);
  const colors = computed<ProductColor[]>(() => data.value?.colors ?? []);

  const isLoading = pending;

  const colorById = computed<Record<number, ProductColor>>(() => {
    return colors.value.reduce<Record<number, ProductColor>>((acc, color) => {
      acc[color.id] = color;
      return acc;
    }, {});
  });

  const productMetaById = computed<CatalogProductMetaById>(() => {
    return products.value.reduce<CatalogProductMetaById>((acc, product) => {
      const colorOptions: CatalogProductColorOption[] = product.variants
        .filter(v => v.isActive && v.inStock && v.colorId !== null)
        .map(v => {
          const color = colorById.value[v.colorId!];
          if (!color) {
            return null;
          }

          const price = Number(v.price);
          if (Number.isNaN(price)) {
            return null;
          }

          return {
            variationId: v.id,
            colorId: color.id,
            colorName: color.name,
            colorHex: color.hex ?? '#9ca3af',
            price,
          };
        })
        .filter((o): o is CatalogProductColorOption => Boolean(o))
        .sort((a, b) => a.price - b.price);

      acc[product.id] = {
        colorOptions,
        defaultVariationId: colorOptions[0]?.variationId ?? null,
      };

      return acc;
    }, {});
  });

  return { categories, products, productMetaById, isLoading, error, refresh };
}
