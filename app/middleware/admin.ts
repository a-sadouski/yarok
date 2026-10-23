export default defineNuxtRouteMiddleware(async to => {
  if (!to.path.startsWith('/admin')) {
    return;
  }

  if (to.path === '/admin/login') {
    return;
  }

  try {
    await useRequestFetch()('/api/admin/me');
  } catch {
    return navigateTo('/admin/login');
  }
});
