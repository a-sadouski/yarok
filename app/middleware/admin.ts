import { AdminApi } from '~/api/admin.api';

export default defineNuxtRouteMiddleware(async to => {
  if (!to.path.startsWith('/admin')) {
    return;
  }

  if (to.path === '/admin/login') {
    return;
  }

  try {
    await AdminApi.me(useRequestFetch());
  } catch {
    return navigateTo('/admin/login');
  }
});
