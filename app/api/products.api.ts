import type { ProductColor, ProductItem } from '~/types';

export const ProductsApi = {
  async getAllProducts(): Promise<ProductItem[]> {
    return await $fetch('/api/products', {});
  },

  async createProduct(product: any) {
    return await $fetch('/api/products/create', {
      method: 'POST',
      body: product,
    });
  },

  async updateProduct(id: number, product: FormData) {
    return await $fetch(`/api/products/${id}`, {
      method: 'PUT',
      body: product,
    });
  },

  async getAllCategories(): Promise<ProductItem[]> {
    return await $fetch('/api/categories');
  },

  async getAllColors(): Promise<ProductColor[]> {
    return await $fetch('/api/colors');
  },
};
