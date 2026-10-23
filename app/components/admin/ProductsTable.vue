<script setup lang="ts">
import { computed, h, resolveComponent } from 'vue';
import { formatPrice } from '~/utils/formatPrice';
import type { ProductItem } from '~/types/product';

const props = defineProps<{
  products: ProductItem[];
  getCategoryLabel: (categoryId: number | null) => string;
}>();

const emit = defineEmits<{
  edit: [product: ProductItem];
  delete: [id: number];
}>();

const UButton = resolveComponent('UButton');

const columns = computed(() => [
  {
    accessorKey: 'name',
    header: 'Название',
    cell: ({ row }: { row: { original: ProductItem } }) =>
      h('span', { class: 'text-sm font-semibold text-primary-700' }, row.original.name),
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }: { row: { original: ProductItem } }) =>
      h('span', { class: 'text-sm text-slate-600' }, row.original.slug),
  },
  {
    accessorKey: 'categoryId',
    header: 'Категория',
    cell: ({ row }: { row: { original: ProductItem } }) =>
      h('span', { class: 'text-sm text-slate-600' }, props.getCategoryLabel(row.original.categoryId)),
  },
  {
    id: 'price',
    header: 'Цена',
    cell: ({ row }: { row: { original: ProductItem } }) =>
      h('span', { class: 'text-sm text-slate-600' }, formatPrice(row.original.variants.length ? Math.min(...row.original.variants.map(variant => Number(variant.price))) : 0)),
  },
  {
    accessorKey: 'isActive',
    header: 'Статус',
    cell: ({ row }: { row: { original: ProductItem } }) =>
      h(
        'span',
        {
          class: [
            'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
            row.original.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500',
          ],
        },
        row.original.isActive ? 'Активен' : 'Скрыт',
      ),
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-right w-full' }, 'Действия'),
    cell: ({ row }: { row: { original: ProductItem } }) =>
      h('div', { class: 'flex justify-end gap-2' }, [
        h(UButton, {
          label: 'Редактировать',
          variant: 'soft',
          color: 'neutral',
          class: 'cursor-pointer rounded-full',
          onClick: () => emit('edit', row.original),
        }),
        h(UButton, {
          label: 'Удалить',
          variant: 'soft',
          color: 'error',
          class: 'cursor-pointer rounded-full',
          onClick: () => emit('delete', row.original.id),
        }),
      ]),
  },
]);
</script>

<template>
  <div class="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
    <UTable
      :data="products"
      :columns="columns"
      :ui="{
        thead: 'bg-slate-50',
        th: 'px-6 py-4 text-left text-sm font-bold text-primary-700',
        td: 'px-6 py-5 align-middle',
        tr: 'border-b border-slate-100 last:border-b-0',
      }"
    />

    <div v-if="!products.length" class="px-6 py-10 text-center text-sm text-slate-500">Пока нет товаров</div>
  </div>
</template>
