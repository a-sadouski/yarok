import type { ProductCategory, ProductColor, ProductItem, ProductSaveResult } from '~/types';

export const ProductsApi = {
  async getAllProducts(): Promise<ProductItem[]> {
    return await $fetch('/api/products', {});
  },

  async createProduct(product: FormData) {
    return await $fetch<ProductSaveResult>('/api/products/create', {
      method: 'POST',
      body: product,
    });
  },

  async updateProduct(id: number, product: FormData) {
    return await $fetch<ProductSaveResult>(`/api/products/${id}`, {
      method: 'PUT',
      body: product,
    });
  },

  async getAllCategories(): Promise<ProductCategory[]> {
    return await $fetch('/api/categories');
  },

  async getAllColors(): Promise<ProductColor[]> {
    return await $fetch('/api/colors');
  },
};
