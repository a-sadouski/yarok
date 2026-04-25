<script setup lang="ts">
import type { ProductPreviewCardModel } from '~/types/product';

defineProps<{
  preview: ProductPreviewCardModel;
}>();
</script>

<template>
  <div>
    <p class="mb-4 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">Предпросмотр карточки</p>

    <article class="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <div class="relative overflow-hidden">
        <img :src="preview.image" :alt="preview.title" class="h-56 w-full object-cover" />

        <div
          class="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-secondary-600 shadow-sm"
        >
          Предпросмотр
        </div>
      </div>

      <div class="p-5">
        <div class="flex items-center gap-2">
          <span
            class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
            :class="preview.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'"
          >
            {{ preview.isActive ? 'Активен' : 'Скрыт' }}
          </span>
        </div>

        <h3 class="mt-4 text-xl font-bold leading-snug text-primary-700">
          {{ preview.title }}
        </h3>

        <p class="mt-2 text-sm leading-6 text-slate-500">
          {{ preview.categoryLabel }}
        </p>

        <div class="mt-4 flex items-center justify-between gap-4">
          <p class="text-lg font-semibold text-secondary-600">
            {{ preview.price }}
          </p>
        </div>
      </div>
    </article>
  </div>
</template>
