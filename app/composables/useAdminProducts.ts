import type {
  CategoryOption,
  ColorOption,
  ProductColor,
  ProductFormState,
  ProductPreviewCardModel,
  ProductItem,
  ProductCategory,
} from '~/types/product';
import { ProductsApi } from '~/api/products.api';
import { getApiErrorMessage } from '~/utils/api-error';
import { slugify } from '~/utils/slugify';

export function useAdminProducts() {
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

  const formState = ref<ProductFormState>(createInitialFormState());
  const imageFile = ref<File | null>(null);

  const grayColorId = computed<number | null>(() => {
    const grayColor = colors.value.find(color => color.slug === DEFAULT_GRAY_COLOR_SLUG);

    return grayColor?.id ?? null;
  });

  const previewCard = computed<ProductPreviewCardModel>(() => {
    const defaultVariant =
      formState.value.variants.find(variant => variant.colorId === grayColorId.value) ?? formState.value.variants[0];

    return {
      title: formState.value.name || 'Новый товар',
      categoryLabel: getCategoryLabel(formState.value.categoryId),
      image: formState.value.previewImage || '',
      price: !formState.value.isVariable ? formState.value.price || '—' : defaultVariant?.price || '—',
      isActive: formState.value.isActive,
    };
  });

  function resetFormState() {
    formState.value = createInitialFormState();
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
      if (imageFile.value === file && isProductModalOpen.value) {
        formState.value.previewImage = String(reader.result || '');
      }
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    imageFile.value = null;
    formState.value.previewImage = '';
  }

  function getCategoryLabel(categoryId: number | null) {
    if (!categoryId) {
      return 'Без категории';
    }

    return categories.value.find(item => item.id === categoryId)?.name ?? 'Без категории';
  }

  const isSaving = ref(false);

  async function handleSubmitProduct() {
    if (isSaving.value) {
      return;
    }
    isSaving.value = true;
    try {
      const formData = new FormData();

      formData.append('name', formState.value.name);
      formData.append('slug', slugify(formState.value.name));
      formData.append('description', formState.value.description || '');
      formData.append('categoryId', String(formState.value.categoryId));
      formData.append('isVariable', String(formState.value.isVariable));
      formData.append('isActive', String(formState.value.isActive));

      if (!formState.value.isVariable) {
        formData.append('colorId', String(grayColorId.value ?? ''));
        formData.append('price', formState.value.price);
        formData.append('sku', formState.value.sku || '');
        formData.append('inStock', String(formState.value.inStock));
      } else {
        formData.append(
          'variants',
          JSON.stringify(
            formState.value.variants.map(variant => ({
              colorId: variant.colorId,
              price: String(variant.price),
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

      handleCloseModal();
      try {
        products.value = await ProductsApi.getAllProducts();
      } catch {
        loadError.value = 'Товар сохранён, но список не обновился. Повторите загрузку.';
      }
    } catch (error) {
      toast.add({
        title: getApiErrorMessage(error, 'Не удалось сохранить товар. Попробуйте ещё раз.'),
        color: 'error',
      });
    } finally {
      isSaving.value = false;
    }
  }

  function openEditModal(product: ProductItem) {
    resetFormState();

    isEditing.value = true;
    isProductModalOpen.value = true;
    editingProductId.value = product.id;

    formState.value.name = product.name;
    formState.value.categoryId = product.categoryId;
    formState.value.description = product.description || '';
    formState.value.isVariable = product.isVariable;
    formState.value.isActive = product.isActive;
    formState.value.previewImage = product.previewImage || '';

    if (!product.isVariable) {
      const firstVariant = product.variants?.[0];

      formState.value.price = String(firstVariant?.price ?? '');
      formState.value.sku = firstVariant?.sku || '';
      formState.value.inStock = firstVariant?.inStock ?? true;
      formState.value.variants = [];
    } else {
      formState.value.price = '';
      formState.value.sku = '';
      formState.value.inStock = true;

      formState.value.variants = (product.variants || []).map(variant => ({
        colorId: variant.colorId,
        price: String(variant.price ?? ''),
        sku: variant.sku || '',
        inStock: variant.inStock ?? true,
      }));
    }

    imageFile.value = null;
  }

  const isLoading = ref(false);
  const loadError = ref('');

  async function loadProducts() {
    isLoading.value = true;
    loadError.value = '';
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
      loadError.value = getApiErrorMessage(error, 'Не удалось загрузить данные админки. Повторите загрузку.');
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(loadProducts);

  return {
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
  };
}
