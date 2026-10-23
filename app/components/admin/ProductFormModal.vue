<script setup lang="ts">
import ProductPreviewCard from './ProductPreviewCard.vue';
import type { CategoryOption, ColorOption, ProductFormState, ProductPreviewCardModel } from '~/types/product';

const toast = useToast();

const props = defineProps<{
  open: boolean;
  isEditing: boolean;
  formState: ProductFormState;
  categoryOptions: CategoryOption[];
  colorOptions: ColorOption[];
  previewCard: ProductPreviewCardModel;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  submit: [];
  close: [];
  imageChange: [event: Event];
  removeImage: [];
}>();

function addVariant() {
  props.formState.variants.push({
    colorId: null,
    price: '',
    sku: '',
    inStock: true,
  });
}

function removeVariant(index: number) {
  props.formState.variants.splice(index, 1);
}

function handleSubmit() {
  if (!props.formState.name.trim()) {
    toast.add({
      title: 'Введите название товара',
      color: 'error',
    });

    return;
  }

  if (!props.formState.categoryId) {
    toast.add({
      title: 'Выберите категорию',
      color: 'error',
    });

    return;
  }

  if (!props.formState.isVariable) {
    if (!props.formState.price || Number(props.formState.price) <= 0) {
      toast.add({
        title: 'Введите цену товара',
        color: 'error',
      });

      return;
    }
  }

  if (props.formState.isVariable) {
    if (!props.formState.variants.length) {
      toast.add({
        title: 'Добавьте хотя бы один вариант товара',
        color: 'error',
      });

      return;
    }

    const hasInvalidVariant = props.formState.variants.some(
      variant => !variant.colorId || !variant.price || Number(variant.price) <= 0,
    );

    if (hasInvalidVariant) {
      toast.add({
        title: 'Заполните цвет и цену для всех вариантов',
        color: 'error',
      });

      return;
    }
  }

  emit('submit');
}
</script>

<template>
  <UModal :open="open" :ui="{ content: 'max-w-7xl' }" @update:open="emit('update:open', $event)">
    <template #content>
      <div class="overflow-auto rounded-[28px] bg-white p-6 sm:p-8">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold text-primary-700">
              {{ isEditing ? 'Редактировать товар' : 'Добавить товар' }}
            </h2>
          </div>

          <UButton icon="i-lucide-x" color="neutral" variant="ghost" square @click="emit('close')" />
        </div>

        <UForm :state="formState" @submit="handleSubmit">
          <div class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_380px]">
            <div class="space-y-5">
              <UFormField label="Название товара" name="name" required>
                <UInput v-model="formState.name" placeholder="Например, Старый город" class="w-full" />
              </UFormField>

              <UFormField label="Категория" name="categoryId" required>
                <USelect
                  :model-value="formState.categoryId ?? undefined" @update:model-value="formState.categoryId = $event ?? null"
                  :items="categoryOptions"
                  value-key="value"
                  option-attribute="label"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Описание" name="description">
                <UTextarea
                  v-model="formState.description"
                  :rows="2"
                  placeholder="Краткое описание товара"
                  class="w-full"
                />
              </UFormField>

              <UFormField name="isVariable">
                <div
                  class="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p class="text-sm font-semibold text-primary-700">Вариативный товар</p>
                    <p class="mt-1 text-xs text-slate-500">
                      Если включено, товар будет создаваться с вариантами по цвету.
                    </p>
                  </div>

                  <USwitch v-model="formState.isVariable"> </USwitch>
                </div>
              </UFormField>

              <template v-if="!formState.isVariable">
                <div class="grid gap-4 sm:grid-cols-2">
                  <UFormField label="Цена" name="price" required>
                    <UInput
                      v-model="formState.price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Например, 45"
                      class="w-full"
                    />
                  </UFormField>

                  <UFormField label="SKU" name="sku">
                    <UInput v-model="formState.sku" placeholder="Например, SG-BASE" class="w-full" />
                  </UFormField>
                </div>

                <UFormField name="inStock">
                  <div
                    class="flex h-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <p class="text-sm font-semibold text-primary-700">В наличии</p>
                    </div>

                    <USwitch v-model="formState.inStock" />
                  </div>
                </UFormField>
              </template>

              <template v-else>
                <div class="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <p class="text-sm font-semibold text-primary-700">Варианты товара</p>
                      <p class="mt-1 text-xs text-slate-500">Добавьте варианты по цвету с отдельной ценой.</p>
                    </div>

                    <UButton
                      label="Добавить вариант"
                      icon="i-lucide-plus"
                      variant="soft"
                      color="secondary"
                      class="rounded-full"
                      @click="addVariant"
                    />
                  </div>

                  <div
                    v-if="!formState.variants?.length"
                    class="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500"
                  >
                    Пока нет вариантов. Добавьте хотя бы один цвет.
                  </div>

                  <div
                    v-for="(variant, index) in formState.variants"
                    :key="index"
                    class="space-y-4 rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div class="flex items-start justify-between gap-4">
                      <p class="text-sm font-semibold text-primary-700">Вариант #{{ index + 1 }}</p>

                      <UButton
                        icon="i-lucide-trash-2"
                        color="error"
                        variant="ghost"
                        square
                        @click="removeVariant(index)"
                      />
                    </div>

                    <UFormField label="Цвет" :name="`variants.${index}.colorId`" required>
                      <USelect
                        :model-value="variant.colorId ?? undefined" @update:model-value="variant.colorId = $event ?? null"
                        :items="colorOptions"
                        value-key="value"
                        option-attribute="label"
                        class="w-full"
                      />
                    </UFormField>

                    <div class="grid gap-4 sm:grid-cols-2">
                      <UFormField label="Цена" :name="`variants.${index}.price`" required>
                        <UInput
                          v-model="variant.price"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Например, 45"
                          class="w-full"
                        />
                      </UFormField>

                      <UFormField label="SKU" :name="`variants.${index}.sku`">
                        <UInput v-model="variant.sku" placeholder="Например, SG-GRAY" class="w-full" />
                      </UFormField>
                    </div>

                    <UFormField :name="`variants.${index}.inStock`">
                      <div
                        class="flex h-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <div>
                          <p class="text-sm font-semibold text-primary-700">В наличии</p>
                        </div>

                        <USwitch v-model="variant.inStock" />
                      </div>
                    </UFormField>
                  </div>
                </div>
              </template>

              <UFormField label="Изображение для превью" name="previewImage">
                <div class="space-y-4">
                  <label
                    class="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-secondary-400 hover:bg-secondary-50/40"
                  >
                    <UIcon name="i-lucide-image-plus" class="h-7 w-7 text-secondary-600" />
                    <span class="mt-3 text-sm font-semibold text-primary-700">Выбрать изображение</span>
                    <span class="mt-1 text-xs text-slate-500">PNG, JPG, WEBP</span>

                    <input type="file" accept="image/*" class="hidden" @change="emit('imageChange', $event)" />
                  </label>

                  <div v-if="formState.previewImage" class="flex items-center gap-3">
                    <UButton
                      label="Удалить изображение"
                      variant="soft"
                      color="error"
                      class="rounded-full"
                      @click="emit('removeImage')"
                    />
                  </div>
                </div>
              </UFormField>

              <UFormField name="isActive">
                <div
                  class="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p class="text-sm font-semibold text-primary-700">Показывать товар в каталоге</p>
                    <p class="mt-1 text-xs text-slate-500">Неактивные товары можно скрыть без удаления.</p>
                  </div>

                  <USwitch v-model="formState.isActive" />
                </div>
              </UFormField>
            </div>

            <div class="flex flex-col">
              <ProductPreviewCard :preview="previewCard" />

              <div class="mt-12 flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <UButton label="Отмена" variant="soft" color="neutral" class="rounded-full" @click="emit('close')" />

                <UButton
                  type="submit"
                  :label="isEditing ? 'Сохранить изменения' : 'Добавить товар'"
                  class="cursor-pointer rounded-full bg-secondary-700 px-6 text-white hover:bg-secondary-500"
                />
              </div>
            </div>
          </div>
        </UForm>
      </div>
    </template>
  </UModal>
</template>
