import type { YandexMaps } from '../types/yandex-maps';

export function createYandexMapsLoader(apiKey: string, timeoutMs = 15000) {
  let pending: Promise<YandexMaps> | null = null;

  return function load(): Promise<YandexMaps> {
    if (pending) {
      return pending;
    }
    if (!apiKey) {
      return Promise.reject(new Error('Yandex Maps API key is missing'));
    }

    pending = new Promise<YandexMaps>((resolve, reject) => {
      const script = document.createElement('script');
      let settled = false;
      const finish = (error?: Error) => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timer);
        script.onload = null;
        script.onerror = null;
        if (error) {
          script.remove();
          reject(error);
        } else if (window.ymaps) {
          resolve(window.ymaps);
        }
      };
      const ready = () => {
        if (!window.ymaps) {
          return finish(new Error('Yandex Maps API is unavailable'));
        }
        window.ymaps.ready(() => finish());
      };
      const timer = setTimeout(() => finish(new Error('Yandex Maps loading timed out')), timeoutMs);
      if (window.ymaps) {
        ready();
      } else {
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`;
        script.async = true;
        script.onload = ready;
        script.onerror = () => finish(new Error('Failed to load Yandex Maps'));
        document.head.appendChild(script);
      }
    }).catch(error => {
      pending = null;
      throw error;
    });

    return pending;
  };
}
