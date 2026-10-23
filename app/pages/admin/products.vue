<script setup lang="ts">
import ProductsTable from '~/components/admin/ProductsTable.vue';
import ProductFormModal from '~/components/admin/ProductFormModal.vue';

definePageMeta({ middleware: ['admin'] });

const {
  isProductModalOpen,
  isEditing,
  formState,
  categoryOptions,
  colorOptions,
  previewCard,
  productName,
  filteredProducts,
  isSaving,
  isLoading,
  loadError,
  loadProducts,
  openCreateModal,
  openEditModal,
  handleCloseModal,
  handleSubmitProduct,
  handleImageChange,
  handleRemoveImage,
  getCategoryLabel,
} = useAdminProducts();
</script>

<template>
  <div class="min-h-screen bg-[#f8f6f5]">
    <section class="border-b border-slate-200 bg-white">
      <div
        class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:px-6 lg:px-8 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-600">Админка</p>
          <h2 class="mt-3 text-3xl font-extrabold text-primary-700 sm:text-4xl">Управление товарами</h2>
          <p class="mt-3 max-w-2xl text-base leading-7 text-slate-500">
            Управление товарами каталога и вариациями по цветам.
          </p>
        </div>

        <UInput v-model="productName" icon="i-lucide-search" class="w-full sm:w-80" placeholder="Поиск по названию" />

        <div class="flex items-center">
          <UButton
            label="Добавить товар"
            icon="i-lucide-plus"
            class="cursor-pointer justify-center rounded-full bg-secondary-700 px-6 py-3 text-white hover:bg-secondary-500"
            :disabled="isLoading || isSaving || Boolean(loadError)"
            @click="openCreateModal"
          />
        </div>
      </div>
    </section>

    <section class="py-8 sm:py-10">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p v-if="isLoading" role="status">Загрузка товаров...</p>
        <div v-else-if="loadError" role="alert">
          <p>{{ loadError }}</p>
          <UButton label="Повторить загрузку" class="mt-3" @click="loadProducts" />
        </div>
        <p v-else-if="!filteredProducts.length">Товары не найдены. Добавьте товар или измените поиск.</p>
        <ProductsTable
          v-else
          :products="filteredProducts"
          :get-category-label="getCategoryLabel"
          @edit="openEditModal"
        />
      </div>
    </section>

    <ProductFormModal
      v-model:open="isProductModalOpen"
      v-model:form-state="formState"
      :is-editing="isEditing"
      :saving="isSaving"
      :category-options="categoryOptions"
      :color-options="colorOptions"
      :preview-card="previewCard"
      @submit="handleSubmitProduct"
      @close="handleCloseModal"
      @image-change="handleImageChange"
      @remove-image="handleRemoveImage"
    />
  </div>
</template>
