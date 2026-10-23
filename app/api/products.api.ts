import type { ProductCategory, ProductColor, ProductItem, ProductSaveResult } from '~/types';

export const ProductsApi = {
  async getAllProducts(): Promise<ProductItem[]> {
    return await $fetch('/api/products', { timeout: 10000 });
  },

  async createProduct(product: FormData) {
    return await $fetch<ProductSaveResult>('/api/products/create', {
      method: 'POST',
      headers: { 'X-Yarok-Admin': '1' },
      retry: 0,
      timeout: 30000,
      body: product,
    });
  },

  async updateProduct(id: number, product: FormData) {
    return await $fetch<ProductSaveResult>(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'X-Yarok-Admin': '1' },
      retry: 0,
      timeout: 30000,
      body: product,
    });
  },

  async getAllCategories(): Promise<ProductCategory[]> {
    return await $fetch('/api/categories', { timeout: 10000 });
  },

  async getAllColors(): Promise<ProductColor[]> {
    return await $fetch('/api/colors', { timeout: 10000 });
  },
};
