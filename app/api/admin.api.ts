export const AdminApi = {
  login(body: { login: string; password: string }) {
    return $fetch<{ success: boolean }>('/api/admin/login', { method: 'POST', body });
  },

  me(fetcher: ReturnType<typeof useRequestFetch>) {
    return fetcher<{ authenticated: boolean }>('/api/admin/me');
  },
};
