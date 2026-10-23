<script setup lang="ts">
import Loader from '~/components/common/Loader.vue';

const route = useRoute();
const siteUrl = useRuntimeConfig().public.siteUrl;

const category = computed(() => route.params.category as string | undefined);

const categoryMetaMap: Record<string, { title: string; description: string }> = {
  'vibropressovannaya-plitka': {
    title: 'Вибропрессованная тротуарная плитка в Слуцке — каталог | Yarok',
    description: 'Каталог вибропрессованной тротуарной плитки. Купить плитку в Слуцке и Минской области с доставкой.',
  },
  'vibrolitaya-plitka': {
    title: 'Вибролитая тротуарная плитка в Слуцке — каталог | Yarok',
    description: 'Каталог вибролитой тротуарной плитки. Декоративные решения с доставкой по Слуцку и Минской области.',
  },
  bordyury: {
    title: 'Бордюры в Слуцке — каталог | Yarok',
    description: 'Каталог бордюров и ЖБИ. Купить бордюры в Слуцке и Минской области с доставкой.',
  },
  'dekorativnye-izdeliya': {
    title: 'Декоративные изделия из бетона в Слуцке — каталог | Yarok',
    description:
      'Каталог декоративных бетонных изделий. Элементы благоустройства с доставкой по Слуцку и Минской области.',
  },
};

const fallbackMeta = {
  title: 'Каталог тротуарной плитки в Слуцке — Yarok',
  description: 'Каталог тротуарной плитки, бордюров и ЖБИ изделий. Купить с доставкой по Слуцку и Минской области.',
};

const meta = computed(() => (category.value ? (categoryMetaMap[category.value] ?? fallbackMeta) : fallbackMeta));

const url = computed(() => (category.value ? `${siteUrl}/catalog/${category.value}` : `${siteUrl}/catalog`));

useSeoMeta({
  title: () => meta.value.title,
  description: () => meta.value.description,
  ogTitle: () => meta.value.title,
  ogDescription: () => meta.value.description,
  ogImage: `${siteUrl}/og-image.jpg`,
  ogUrl: () => url.value,
  ogSiteName: 'Yarok',
  ogType: 'website',
  twitterCard: 'summary_large_image',
});

useHead({
  link: [
    {
      rel: 'canonical',
      href: () => url.value,
    },
  ],
});

const seoTextMap: Record<string, { title: string; paragraphs: string[] }> = {
  'vibropressovannaya-plitka': {
    title: 'Вибропрессованная тротуарная плитка в Слуцке',
    paragraphs: [
      'Вибропрессованная тротуарная плитка — это прочное и долговечное решение для дворов, парковок и пешеходных зон.',
      'Такая плитка устойчива к нагрузкам и погодным условиям, что делает её отличным выбором для Слуцка и Минской области.',
      'Вы можете купить плитку от производителя Yarok с доставкой по Слуцку и области.',
    ],
  },
  'vibrolitaya-plitka': {
    title: 'Вибролитая тротуарная плитка в Слуцке',
    paragraphs: [
      'Вибролитая плитка отличается декоративным внешним видом и разнообразием форм.',
      'Отлично подходит для благоустройства частных домов и садовых дорожек.',
    ],
  },
  bordyury: {
    title: 'Бордюры в Слуцке',
    paragraphs: [
      'Бордюры используются для фиксации плитки и разделения зон.',
      'Они обеспечивают аккуратный внешний вид и долговечность покрытия.',
    ],
  },
  'dekorativnye-izdeliya': {
    title: 'Декоративные изделия из бетона в Слуцке',
    paragraphs: [
      'Декоративные бетонные изделия помогают оформить участок и придать ему завершённый вид.',
      'Подходят для садов, дворов и зон отдыха.',
    ],
  },
};

const seoContent = computed(() => (category.value ? (seoTextMap[category.value] ?? null) : null));

const { categories, products, productMetaById, isLoading, error, refresh } = await useCatalog();
const currentCategory = computed(() => categories.value.find(item => item.slug === category.value));
watchEffect(() => {
  if (!isLoading.value && !error.value && category.value && !currentCategory.value) {
    showError({ statusCode: 404, statusMessage: 'Категория не найдена' });
  }
});
</script>
<template>
  <div class="min-h-screen bg-[#f8f6f5] text-primary-700">
    <AppHeader />

    <main class="flex min-h-[calc(100vh-140px)] flex-col">
      <section class="bg-white pt-32 pb-4">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-600">Каталог</p>

          <h1 class="mt-3 text-4xl font-extrabold sm:text-5xl">
            {{ currentCategory?.name || 'Каталог тротуарной плитки' }}
          </h1>
        </div>
      </section>

      <div v-if="isLoading" class="flex flex-1 items-center justify-center">
        <Loader size="lg" label="Загрузка каталога..." />
      </div>

      <section v-else-if="error" class="mx-auto max-w-7xl px-4 py-6" role="alert">
        <p>Не удалось загрузить каталог. Попробуйте ещё раз.</p>
        <UButton label="Повторить загрузку" class="mt-3" @click="refresh()" />
      </section>

      <section v-else class="py-6">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p v-if="!categories.length" role="status">
            Каталог пока пуст. Свяжитесь с нами, чтобы уточнить ассортимент.
          </p>
          <CatalogTabs v-else :categories="categories" :products="products" :product-meta-by-id="productMetaById" />
        </div>
      </section>

      <section v-if="seoContent" class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16 text-sm text-gray-600">
        <details class="group">
          <summary
            class="mx-auto inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium text-primary-600 transition hover:bg-gray-100 cursor-pointer"
          >
            Подробнее о категории
          </summary>

          <div class="mt-4 space-y-4">
            <h2 class="text-2xl font-semibold text-gray-900">
              {{ seoContent.title }}
            </h2>

            <p v-for="(p, i) in seoContent.paragraphs" :key="i" class="leading-relaxed text-md">
              {{ p }}
            </p>
          </div>
        </details>
      </section>
    </main>

    <AppFooter />
  </div>
</template>
