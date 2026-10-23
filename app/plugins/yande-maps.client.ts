import type { YandexMaps } from '~/types/yandex-maps';

declare global {
  interface Window {
    ymaps?: YandexMaps;
  }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const loadYandexMaps = (): Promise<YandexMaps> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Yandex Maps can be loaded only on client side'));
        return;
      }

      if (window.ymaps) {
        window.ymaps.ready(() => resolve(window.ymaps!));
        return;
      }

      const existingScript = document.querySelector<HTMLScriptElement>('script[data-yandex-maps="true"]');

      if (existingScript) {
        existingScript.addEventListener('load', () => {
          if (!window.ymaps) {
            reject(new Error('Yandex Maps script loaded, but ymaps is unavailable'));
            return;
          }

          window.ymaps.ready(() => resolve(window.ymaps!));
        });

        existingScript.addEventListener('error', () => {
          reject(new Error('Failed to load Yandex Maps script'));
        });

        return;
      }

      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${config.public.yandexMapsApiKey}&lang=ru_RU`;
      script.async = true;
      script.dataset.yandexMaps = 'true';

      script.onload = () => {
        if (!window.ymaps) {
          reject(new Error('Yandex Maps loaded, but ymaps is missing'));
          return;
        }

        window.ymaps.ready(() => resolve(window.ymaps!));
      };

      script.onerror = () => reject(new Error('Failed to load Yandex Maps script'));

      document.head.appendChild(script);
    });
  };

  return {
    provide: {
      loadYandexMaps,
    },
  };
});
