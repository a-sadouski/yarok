export const AdminApi = {
  login(body: { login: string; password: string }) {
    return $fetch<{ success: boolean }>('/api/admin/login', {
      method: 'POST',
      body,
      headers: { 'X-Yarok-Admin': '1' },
      retry: 0,
      timeout: 30000,
    });
  },

  logout() {
    return $fetch<{ success: boolean }>('/api/admin/logout', {
      method: 'POST',
      headers: { 'X-Yarok-Admin': '1' },
      retry: 0,
      timeout: 30000,
    });
  },

  products() {
    return $fetch<import('~/types').ProductItem[]>('/api/admin/products', { cache: 'no-store', timeout: 10000 });
  },

  me(fetcher: ReturnType<typeof useRequestFetch>) {
    return fetcher<{ authenticated: boolean }>('/api/admin/me', { timeout: 10000, cache: 'no-store' });
  },
};
