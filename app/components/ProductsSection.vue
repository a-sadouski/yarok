<script setup lang="ts">
import { computed } from 'vue';
import { ProductsApi } from '~/api/products.api';

type Category = {
  id: number;
  name: string;
  slug: string;
};

type CategoryCard = {
  id: number;
  title: string;
  slug: string;
  image: string;
  alt: string;
};

const categoryUiMap: Record<string, { image: string; alt: string }> = {
  'vibropressovannaya-plitka': {
    image: '/images/vibropressed.png',
    alt: 'Вибропрессованная плитка',
  },
  'vibrolitaya-plitka': {
    image: '/images/vibrocast.png',
    alt: 'Вибролитая плитка',
  },
  bordyury: {
    image: '/images/bord.png',
    alt: 'Бордюры',
  },
  'dekorativnye-izdeliya': {
    image: '/images/dec.png',
    alt: 'Декоративные изделия',
  },
};

const { data: categories } = await useAsyncData<Category[]>('product-categories-home', () =>
  ProductsApi.getAllCategories(),
);

const items = computed((): CategoryCard[] => {
  return (categories.value || []).reduce<CategoryCard[]>((acc, category) => {
    const ui = categoryUiMap[category.slug];

    if (!ui) {
      return acc;
    }

    acc.push({
      id: category.id,
      title: category.name,
      slug: category.slug,
      image: ui.image,
      alt: ui.alt,
    });

    return acc;
  }, []);
});
</script>

<template>
  <section id="catalog" class="bg-[#f6f3f2] scroll-mt-20 py-16 sm:py-10">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-8 flex items-end justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-600">Каталог продукции</p>

          <h2 class="mt-2 text-3xl font-bold tracking-tight text-primary-700 sm:text-4xl">Наш ассортимент</h2>
        </div>

        <NuxtLink
          to="/catalog/vibropressovannaya-plitka"
          class="hidden text-md font-semibold text-secondary-600 transition-colors hover:text-secondary-500 sm:inline-flex"
        >
          Весь каталог >
        </NuxtLink>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <NuxtLink v-for="item in items" :key="item.id" :to="`/catalog/${item.slug}`" class="group block">
          <article>
            <div class="relative overflow-hidden rounded-3xl bg-white">
              <img
                :src="item.image"
                :alt="item.alt"
                class="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              />
            </div>

            <div class="px-1 pt-4">
              <h3 class="text-xl font-semibold leading-snug text-primary-700">
                {{ item.title }}
              </h3>
            </div>
          </article>
        </NuxtLink>
      </div>

      <div class="mt-6 sm:hidden">
        <NuxtLink
          to="/catalog/vibropressovannaya-plitka"
          class="inline-flex text-sm font-semibold text-secondary-600 transition-colors hover:text-secondary-500"
        >
          Все товары
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
