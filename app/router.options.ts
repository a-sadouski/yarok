import type { RouterConfig } from '@nuxt/schema';

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    if (to.hash) {
      return {
        el: to.hash,
        top: 80,
        behavior: 'smooth',
      };
    }

    if (to.fullPath !== from.fullPath) {
      return { top: 0 };
    }

    return {};
  },
};
