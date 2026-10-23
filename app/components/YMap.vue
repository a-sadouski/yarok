<script setup lang="ts">
import type { YandexMap } from '~/types/yandex-maps';
const props = withDefaults(
  defineProps<{
    center?: [number, number];
    zoom?: number;
    height?: string;
  }>(),
  {
    center: () => [52.9974267, 27.5939992],
    zoom: 11,
    height: '400px',
  },
);

const mapEl = ref<HTMLElement | null>(null);
let mapInstance: YandexMap | null = null;

const { $loadYandexMaps } = useNuxtApp();

onMounted(async () => {
  try {
    const ymaps = await $loadYandexMaps();

    if (!mapEl.value) {
      return;
    }

    mapInstance = new ymaps.Map(mapEl.value, {
      center: props.center,
      zoom: props.zoom,
      controls: ['zoomControl', 'fullscreenControl'],
    });

    const placemark = new ymaps.Placemark(
      props.center,
      {
        balloonContent: 'Мы здесь',
      },
      {
        preset: 'islands#redDotIcon',
      },
    );

    mapInstance.geoObjects.add(placemark);
  } catch (error) {
    console.error('Yandex Maps init error:', error);
  }
});

onBeforeUnmount(() => {
  if (mapInstance) {
    mapInstance.destroy();
    mapInstance = null;
  }
});
</script>

<template>
  <div ref="mapEl" :style="{ width: '100%', height }" class="rounded-2xl overflow-hidden" />
</template>
