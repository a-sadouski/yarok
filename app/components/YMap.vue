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
const isLoading = ref(false);
const hasError = ref(false);
let disposed = false;

async function initializeMap() {
  if (isLoading.value || disposed) {
    return;
  }
  isLoading.value = true;
  hasError.value = false;
  try {
    const ymaps = await $loadYandexMaps();

    if (!mapEl.value || disposed) {
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
  } catch {
    mapInstance?.destroy();
    mapInstance = null;
    if (!disposed) {
      hasError.value = true;
    }
  } finally {
    isLoading.value = false;
  }
}

onMounted(initializeMap);

onBeforeUnmount(() => {
  disposed = true;
  if (mapInstance) {
    mapInstance.destroy();
    mapInstance = null;
  }
});
</script>

<template>
  <div :style="{ width: '100%', height }" class="relative rounded-2xl overflow-hidden">
    <div ref="mapEl" class="h-full w-full" aria-label="Расположение офиса и склада" />
    <div
      v-if="isLoading || hasError"
      class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white p-4 text-center text-primary-700"
      role="status"
    >
      <p>
        {{ isLoading ? 'Загрузка карты...' : 'Не удалось загрузить карту. Адрес: г. Слуцк, ул. М. Богдановича, 220.' }}
      </p>
      <UButton v-if="hasError" label="Повторить загрузку" @click="initializeMap" />
    </div>
  </div>
</template>
