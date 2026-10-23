// Minimal boundary for the Yandex Maps 2.1 features used by this application.
export interface YandexMap {
  geoObjects: { add: (object: YandexPlacemark) => void };
  destroy: () => void;
}

export interface YandexPlacemark {
  geometry: unknown;
}

export interface YandexMaps {
  ready: (callback: () => void) => void;
  Map: new (
    element: HTMLElement,
    options: {
      center: [number, number];
      zoom: number;
      controls: string[];
    },
  ) => YandexMap;
  Placemark: new (
    coordinates: [number, number],
    properties: { balloonContent: string },
    options: { preset: string },
  ) => YandexPlacemark;
}
