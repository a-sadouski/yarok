import { AdminApi } from '~/api/admin.api';
import { getApiErrorStatus } from '~/utils/api-error';

export default defineNuxtRouteMiddleware(async to => {
  if (!to.path.startsWith('/admin')) {
    return;
  }

  if (to.path === '/admin/login') {
    return;
  }

  try {
    await AdminApi.me(useRequestFetch());
  } catch (error) {
    if (getApiErrorStatus(error) === 401) {
return navigateTo('/admin/login');
}
    throw createError({ statusCode: 503, statusMessage: 'Не удалось проверить сессию. Повторите загрузку страницы.' });
  }
});
