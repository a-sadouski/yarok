import type {
  CategoryOption,
  ColorOption,
  ProductColor,
  ProductFormState,
  ProductPreviewCardModel,
  ProductItem,
  ProductCategory,
} from '~/types/product';
import { AdminApi } from '~/api/admin.api';
import { validateProduct, validateProductImage } from '~/utils/validation';
import { ProductsApi } from '~/api/products.api';
import { getApiErrorMessage, getApiErrorStatus } from '~/utils/api-error';
import { slugify } from '~/utils/slugify';
import { createProductPayload } from '~/utils/product-payload';

export function useAdminProducts() {
  const toast = useToast();

  const DEFAULT_GRAY_COLOR_SLUG = 'seryj';

  const isProductModalOpen = ref(false);
  const isEditing = ref(false);
  const sessionExpired = ref(false);

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
  const removeImage = ref(false);
  const originalImage = ref('');
  const isReadingImage = ref(false);
  const originalVariants = ref<ProductItem['variants']>([]);

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
    removeImage.value = false;
    originalImage.value = '';
    originalVariants.value = [];
    isReadingImage.value = false;
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

    const validationError = validateProductImage(file);
    target.value = '';
    if (validationError) {
      toast.add({ title: validationError, color: 'error' });
      return;
    }
    imageFile.value = file;
    removeImage.value = false;
    isReadingImage.value = true;

    const reader = new FileReader();
    reader.onload = () => {
      if (imageFile.value === file && isProductModalOpen.value) {
        formState.value.previewImage = String(reader.result || '');
        isReadingImage.value = false;
      }
    };
    reader.onerror = () => {
      if (imageFile.value !== file) {
        return;
      }
      imageFile.value = null;
      isReadingImage.value = false;
      formState.value.previewImage = originalImage.value;
      toast.add({ title: 'Не удалось прочитать изображение. Выберите файл ещё раз.', color: 'error' });
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    imageFile.value = null;
    formState.value.previewImage = '';
    removeImage.value = Boolean(originalImage.value);
    isReadingImage.value = false;
  }

  function getCategoryLabel(categoryId: number | null) {
    if (!categoryId) {
      return 'Без категории';
    }

    return categories.value.find(item => item.id === categoryId)?.name ?? 'Без категории';
  }

  const isSaving = ref(false);

  async function handleSubmitProduct() {
    if (isSaving.value || isReadingImage.value) {
      return;
    }
    if (!formState.value.isVariable && !grayColorId.value) {
      toast.add({ title: 'Серый цвет не настроен в справочнике. Обратитесь к администратору.', color: 'error' });
      return;
    }
    const validationError = validateProduct(formState.value);
    if (validationError) {
      toast.add({ title: validationError, color: 'error' });
      return;
    }
    if (!slugify(formState.value.name)) {
      toast.add({ title: 'Название должно содержать буквы или цифры', color: 'error' });
      return;
    }
    isSaving.value = true;
    try {
      const formData = createProductPayload(
        formState.value,
        imageFile.value,
        removeImage.value,
        originalVariants.value,
        grayColorId.value,
      );

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
      sessionExpired.value = false;

      handleCloseModal();
      try {
        products.value = await AdminApi.products();
      } catch {
        loadError.value = 'Товар сохранён, но список не обновился. Повторите загрузку.';
      }
    } catch (error) {
      if (getApiErrorStatus(error) === 401) {
        sessionExpired.value = true;
        toast.add({ title: 'Сессия истекла. Войдите в новой вкладке и повторите сохранение.', color: 'error' });
        return;
      }
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

    originalImage.value = product.previewImage ?? '';
    originalVariants.value = product.variants;
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
        AdminApi.products(),
        ProductsApi.getAllCategories(),
        ProductsApi.getAllColors(),
      ]);

      products.value = loadedProducts;
      sessionExpired.value = false;
      categories.value = loadedCategories;
      colors.value = loadedColors;
    } catch (error) {
      if (getApiErrorStatus(error) === 401) {
        sessionExpired.value = true;
      }
      loadError.value = getApiErrorMessage(error, 'Не удалось загрузить данные админки. Повторите загрузку.');
    } finally {
      isLoading.value = false;
    }
  }

  const isLoggingOut = ref(false);
  async function logout() {
    if (isSaving.value || isLoggingOut.value) {
      return;
    }
    isLoggingOut.value = true;
    try {
      await AdminApi.logout();
      await navigateTo('/admin/login');
    } catch (error) {
      toast.add({ title: getApiErrorMessage(error, 'Не удалось выйти. Повторите попытку.'), color: 'error' });
    } finally {
      isLoggingOut.value = false;
    }
  }

  onMounted(loadProducts);

  return {
    isProductModalOpen,
    isEditing,
    sessionExpired,
    formState,
    categoryOptions,
    colorOptions,
    previewCard,
    productName,
    filteredProducts,
    isSaving,
    isReadingImage,
    isLoggingOut,
    logout,
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
