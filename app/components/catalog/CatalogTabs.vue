<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from '#imports';
import CatalogProductCard from './CatalogProductCard.vue';
import type { CatalogProductMetaById, ProductCategory, ProductItem } from '~/types';

const props = defineProps<{
  categories: ProductCategory[];
  products: ProductItem[];
  productMetaById: CatalogProductMetaById;
}>();

const route = useRoute();

const activeCategorySlug = computed(() => {
  return typeof route.params.category === 'string' ? route.params.category : undefined;
});

const activeCategory = computed(() => {
  if (!props.categories.length) {
    return undefined;
  }

  const matchedCategory = props.categories.find(category => category.slug === activeCategorySlug.value);

  return matchedCategory || props.categories[0];
});

const activeCategoryId = computed(() => activeCategory.value?.id);

const tabItems = computed(() =>
  props.categories.map(category => ({
    label: category.name,
    value: category.id,
    slug: category.slug,
  })),
);

const currentProducts = computed(() => {
  if (!activeCategoryId.value) {
    return [];
  }

  return props.products.filter(product => product.isActive && product.categoryId === activeCategoryId.value);
});
</script>

<template>
  <div>
    <div class="mb-8">
      <div class="hidden md:flex md:flex-wrap md:gap-3">
        <NuxtLink
          v-for="item in tabItems"
          :key="item.value"
          :to="`/catalog/${item.slug}`"
          class="cursor-pointer rounded-full px-5 py-3 text-sm font-semibold transition"
          :class="
            activeCategoryId === item.value
              ? 'bg-secondary-700 text-white shadow-md'
              : 'bg-white text-primary-700 ring-1 ring-slate-200 hover:bg-slate-50'
          "
        >
          {{ item.label }}
        </NuxtLink>
      </div>

      <div class="md:hidden">
        <USelect
          :model-value="activeCategoryId"
          :items="tabItems"
          value-key="value"
          option-attribute="label"
          class="w-full"
          @update:model-value="
            value => {
              const selectedItem = tabItems.find(item => item.value === value);

              if (selectedItem) {
                navigateTo(`/catalog/${selectedItem.slug}`);
              }
            }
          "
        />
      </div>
    </div>

    <div v-if="currentProducts.length" class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      <CatalogProductCard
        v-for="product in currentProducts"
        :key="product.id"
        :product="product"
        :meta="productMetaById[product.id]"
      />
    </div>

    <div v-else class="rounded-[24px] border border-slate-200 bg-white px-6 py-12 text-center text-slate-500">
      В этой категории пока нет товаров.
    </div>
  </div>
</template>
