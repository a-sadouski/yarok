import type { IEmail } from '../types/contact';
import type { ProductFormState } from '../types/product';

export function isValidPrice(value: string): boolean {
  return /^\d{1,8}(\.\d{1,2})?$/.test(value) && Number(value) <= 99999999.99;
}

export function validateContact(form: IEmail): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!form.name.trim() || form.name.trim().length > 200) {
    errors.name = 'Введите имя длиной до 200 символов';
  }
  const digits = form.phone.replace(/\D/g, '');
  if (!/^[+\d\s()-]+$/.test(form.phone) || digits.length < 7 || digits.length > 15) {
    errors.phone = 'Введите телефон: от 7 до 15 цифр';
  }
  if (!form.comment.trim() || form.comment.trim().length > 10000) {
    errors.comment = 'Введите комментарий длиной до 10 000 символов';
  }
  return errors;
}

export function validateProduct(form: ProductFormState): string | null {
  if (!form.name.trim() || form.name.trim().length > 200) {
    return 'Введите название длиной до 200 символов';
  }
  if (!form.categoryId) {
    return 'Выберите категорию';
  }
  if (form.description.length > 10000) {
    return 'Описание должно быть не длиннее 10 000 символов';
  }
  if (!form.isVariable) {
    if (!isValidPrice(form.price)) {
      return 'Введите цену от 0 до 99 999 999,99 с точностью до копейки';
    }
    if (form.sku.length > 100) {
      return 'SKU должен быть не длиннее 100 символов';
    }
  } else {
    if (!form.variants.length || form.variants.length > 100) {
      return 'Добавьте от 1 до 100 вариантов';
    }
    if (form.variants.some(item => !item.colorId || !isValidPrice(item.price) || item.sku.length > 100)) {
      return 'У каждого варианта выберите цвет, укажите корректную цену и SKU до 100 символов';
    }
    if (new Set(form.variants.map(item => item.colorId)).size !== form.variants.length) {
      return 'Цвета вариантов не должны повторяться';
    }
  }
  return null;
}

export function validateProductImage(file: Pick<File, 'size' | 'type'>): string | null {
  if (
    !['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type) ||
    file.size <= 0 ||
    file.size > 10 * 1024 * 1024
  ) {
    return 'Выберите PNG, JPEG, WebP или GIF размером до 10 МБ';
  }
  return null;
}
