<script setup lang="ts">
import type { CatalogProductColorOption, CatalogProductMeta, ProductItem } from '~/types';

const props = defineProps<{
  product: ProductItem;
  meta?: CatalogProductMeta;
}>();

function formatPrice(price: number): string {
  return Number.isInteger(price) ? String(price) : price.toFixed(2);
}

const selectedVariationId = ref<number | null>(props.meta?.defaultVariationId ?? null);

watch(
  () => props.meta?.defaultVariationId,
  newValue => {
    selectedVariationId.value = newValue ?? null;
  },
  { immediate: true },
);

const selectedOption = computed<CatalogProductColorOption | null>(() => {
  if (props.meta?.colorOptions?.length) {
    if (selectedVariationId.value === null) {
      return props.meta.colorOptions[0] ?? null;
    }

    return (
      props.meta.colorOptions.find(option => option.variationId === selectedVariationId.value) ??
      props.meta.colorOptions[0] ??
      null
    );
  }

  const variation = props.product.variants?.find(v => v.isActive && v.inStock);

  if (!variation) {
    return null;
  }

  const price = Number(variation.price);
  if (Number.isNaN(price)) {
    return null;
  }

  return {
    variationId: variation.id,
    colorId: 0,
    colorName: '',
    colorHex: '',
    price,
  };
});
</script>

<template>
  <article class="rounded-[28px] bg-white shadow-sm">
    <NuxtImg
      :src="product.previewImage || '/images/default-tile.png'"
      :alt="`${product.name} - тротуарная плитка в Слуцке`"
      class="h-[220px] w-full rounded-t-[28px] object-cover"
      width="400"
      height="220"
      format="webp"
      quality="80"
      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
      loading="lazy"
    />

    <div class="p-5">
      <h3 class="text-[20px] font-bold text-primary-700">
        {{ product.name }}
      </h3>

      <div class="mt-4 flex justify-between gap-4">
        <div class="flex items-center">
          <div v-if="meta?.colorOptions.length" class="ml-2 flex items-center gap-2">
            <button
              v-for="option in meta.colorOptions"
              :key="option.variationId"
              type="button"
              class="h-6 w-6 cursor-pointer rounded-full border transition"
              :class="
                selectedVariationId === option.variationId
                  ? 'border-primary-700 ring-1 ring-primary-700'
                  : 'border-black/10'
              "
              :style="{ backgroundColor: option.colorHex }"
              :title="option.colorName"
              @click="selectedVariationId = option.variationId"
            />
          </div>
        </div>

        <div v-if="selectedOption" class="text-xl font-bold">{{ formatPrice(selectedOption.price) }} руб.</div>
      </div>
    </div>
  </article>
</template>
