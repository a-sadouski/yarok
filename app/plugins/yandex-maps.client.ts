import { createYandexMapsLoader } from '~/utils/yandex-maps-loader';
import type { YandexMaps } from '~/types/yandex-maps';

declare global {
  interface Window {
    ymaps?: YandexMaps;
  }
}

export default defineNuxtPlugin(() => ({
  provide: {
    loadYandexMaps: createYandexMapsLoader(useRuntimeConfig().public.yandexMapsApiKey ?? ''),
  },
}));
