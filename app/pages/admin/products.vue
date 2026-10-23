<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type {
  CategoryOption,
  ColorOption,
  ProductColor,
  ProductFormState,
  ProductPreviewCardModel,
  ProductItem,
  ProductCategory,
} from '~/types/product';
import ProductsTable from '~/components/admin/ProductsTable.vue';
import { ProductsApi } from '~/api/products.api';
import ProductFormModal from '~/components/admin/ProductFormModal.vue';

definePageMeta({
  middleware: ['admin'],
});

const toast = useToast();

const DEFAULT_GRAY_COLOR_SLUG = 'seryj';

const isProductModalOpen = ref(false);
const isEditing = ref(false);

const products = ref<ProductItem[]>([]);
const categories = ref<ProductCategory[]>([]);
const colors = ref<ProductColor[]>([]);

const editingProductId = ref<number | null>(null);
const productName = ref('');

const filteredProducts = computed(() => {
  const normalizedQuery = productName.value.trim().toLowerCase();
  const preparedProducts = [...products.value].sort((a, b) => a.id - b.id);

  if (!normalizedQuery) {
    return preparedProducts;
  }

  return preparedProducts.filter(product => product.name.toLowerCase().includes(normalizedQuery));
});

const categoryOptions = computed<CategoryOption[]>(() =>
  categories.value.map(category => ({
    label: category.name,
    value: category.id,
  })),
);

const colorOptions = computed<ColorOption[]>(() =>
  colors.value.map(color => ({
    label: color.name,
    value: color.id,
  })),
);

const createInitialFormState = (): ProductFormState => ({
  name: '',
  categoryId: null,
  description: '',
  isVariable: false,
  isActive: true,
  previewImage: '',
  price: '',
  sku: '',
  inStock: true,
  variants: [],
});

const formState = reactive<ProductFormState>(createInitialFormState());
const imageFile = ref<File | null>(null);

const grayColorId = computed<number | null>(() => {
  const grayColor = colors.value.find(color => color.slug === DEFAULT_GRAY_COLOR_SLUG);

  return grayColor?.id ?? null;
});

const previewCard = computed<ProductPreviewCardModel>(() => {
  const defaultVariant =
    formState.variants.find(variant => variant.colorId === grayColorId.value) ?? formState.variants[0];

  return {
    title: formState.name || 'Новый товар',
    categoryLabel: getCategoryLabel(formState.categoryId),
    image: formState.previewImage || '',
    price: !formState.isVariable ? formState.price || '—' : defaultVariant?.price || '—',
    isActive: formState.isActive,
  };
});

function createDefaultVariant() {
  return {
    colorId: grayColorId.value,
    price: '',
    sku: '',
    inStock: true,
  };
}

function resetFormState() {
  Object.assign(formState, createInitialFormState());
  imageFile.value = null;
  editingProductId.value = null;
}

function openCreateModal() {
  resetFormState();
  isEditing.value = false;
  isProductModalOpen.value = true;
}

function handleCloseModal() {
  isProductModalOpen.value = false;
  resetFormState();
}

function handleImageChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    return;
  }

  imageFile.value = file;

  const reader = new FileReader();
  reader.onload = () => {
    formState.previewImage = String(reader.result || '');
  };
  reader.readAsDataURL(file);
}

function handleRemoveImage() {
  imageFile.value = null;
  formState.previewImage = '';
}

function getCategoryLabel(categoryId: number | null) {
  if (!categoryId) {
    return 'Без категории';
  }

  return categories.value.find(item => item.id === categoryId)?.name ?? 'Без категории';
}

async function handleSubmitProduct() {
  try {
    const formData = new FormData();

    formData.append('name', formState.name);
    formData.append('slug', slugify(formState.name));
    formData.append('description', formState.description || '');
    formData.append('categoryId', String(formState.categoryId));
    formData.append('isVariable', String(formState.isVariable));
    formData.append('isActive', String(formState.isActive));

    if (!formState.isVariable) {
      formData.append('colorId', String(grayColorId.value ?? ''));
      formData.append('price', formState.price);
      formData.append('sku', formState.sku || '');
      formData.append('inStock', String(formState.inStock));
    } else {
      formData.append(
        'variants',
        JSON.stringify(
          formState.variants.map(variant => ({
            colorId: variant.colorId,
            price: variant.price,
            sku: variant.sku || '',
            inStock: variant.inStock,
          })),
        ),
      );
    }

    if (imageFile.value) {
      formData.append('image', imageFile.value);
    }

    if (isEditing.value) {
      if (!editingProductId.value) {
        throw new Error('Editing product id is missing');
      }

      await ProductsApi.updateProduct(editingProductId.value, formData);
    } else {
      await ProductsApi.createProduct(formData);
    }

    toast.add({
      title: isEditing.value ? 'Товар обновлен' : 'Товар создан',
      color: 'success',
    });

    products.value = await ProductsApi.getAllProducts();
    handleCloseModal();
  } catch (error: any) {
    toast.add({
      title: error?.data?.statusMessage || 'Не удалось сохранить товар',
      color: 'error',
    });
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/ё/g, 'e')
    .replace(/[^a-zа-я0-9\s-]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function openEditModal(product: ProductItem) {
  resetFormState();

  isEditing.value = true;
  isProductModalOpen.value = true;
  editingProductId.value = product.id;

  formState.name = product.name;
  formState.categoryId = product.categoryId;
  formState.description = product.description || '';
  formState.isVariable = product.isVariable;
  formState.isActive = product.isActive;
  formState.previewImage = product.previewImage || '';

  if (!product.isVariable) {
    const firstVariant = product.variants?.[0];

    formState.price = String(firstVariant?.price ?? '');
    formState.sku = firstVariant?.sku || '';
    formState.inStock = firstVariant?.inStock ?? true;
    formState.variants = [];
  } else {
    formState.price = '';
    formState.sku = '';
    formState.inStock = true;

    formState.variants = (product.variants || []).map(variant => ({
      colorId: variant.colorId,
      price: String(variant.price ?? ''),
      sku: variant.sku || '',
      inStock: variant.inStock ?? true,
    }));
  }

  imageFile.value = null;
}

onMounted(async () => {
  try {
    const [loadedProducts, loadedCategories, loadedColors] = await Promise.all([
      ProductsApi.getAllProducts(),
      ProductsApi.getAllCategories(),
      ProductsApi.getAllColors(),
    ]);

    products.value = loadedProducts;
    categories.value = loadedCategories;
    colors.value = loadedColors;
  } catch (error) {
    console.error(error);

    toast.add({
      title: 'Не удалось загрузить данные админки',
      color: 'error',
    });
  }
});
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
            @click="openCreateModal"
          />
        </div>
      </div>
    </section>

    <section class="py-8 sm:py-10">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProductsTable :products="filteredProducts" :get-category-label="getCategoryLabel" @edit="openEditModal" />
      </div>
    </section>

    <ProductFormModal
      v-model:open="isProductModalOpen"
      :is-editing="isEditing"
      :form-state="formState"
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
