import assert from 'node:assert/strict';
import test from 'node:test';
import { isValidPrice, validateContact, validateProduct, validateProductImage } from '../app/utils/validation';
import { getApiErrorMessage, getApiErrorStatus } from '../app/utils/api-error';
import type { ProductFormState } from '../app/types/product';

const product = (): ProductFormState => ({
  name: 'Товар',
  categoryId: 1,
  description: '',
  isVariable: false,
  isActive: true,
  previewImage: '',
  price: '0',
  sku: '',
  inStock: true,
  variants: [],
});

test('prices reject invalid, fractional and overflowing values while accepting zero', () => {
  for (const value of ['0', '12.50', '99999999.99']) {
    assert.equal(isValidPrice(value), true);
  }
  for (const value of ['', 'NaN', 'Infinity', '-1', '1.234', '1e2', '12,50', '100000000']) {
    assert.equal(isValidPrice(value), false, value);
  }
});

test('product form requires category, bounded fields and distinct variants', () => {
  assert.equal(validateProduct(product()), null);
  assert.ok(validateProduct({ ...product(), categoryId: null }));
  assert.ok(validateProduct({ ...product(), sku: 'a'.repeat(101) }));
  assert.ok(validateProduct({ ...product(), isVariable: true }));
  const variant = { colorId: 1, price: '25', sku: '', inStock: true };
  assert.ok(validateProduct({ ...product(), isVariable: true, variants: [variant, { ...variant }] }));
  assert.equal(
    validateProduct({ ...product(), isVariable: true, variants: [variant, { ...variant, colorId: 2 }] }),
    null,
  );
});

test('contact validation catches whitespace, invalid phones and oversized comments', () => {
  assert.deepEqual(validateContact({ name: 'Иван', phone: '+375 (29) 123-45-67', comment: 'Плитка' }), {});
  assert.equal(Object.keys(validateContact({ name: ' ', phone: '123', comment: ' ' })).length, 3);
  assert.ok(validateContact({ name: 'Иван', phone: 'call 1234567', comment: 'x' }).phone);
  assert.ok(validateContact({ name: 'Иван', phone: '1234567', comment: 'x'.repeat(10001) }).comment);
});

test('image input rejects empty, oversized and unsupported files', () => {
  assert.equal(validateProductImage({ type: 'image/png', size: 10 * 1024 * 1024 }), null);
  for (const file of [
    { type: 'image/svg+xml', size: 20 },
    { type: 'image/png', size: 0 },
    { type: 'image/jpeg', size: 10 * 1024 * 1024 + 1 },
  ]) {
    assert.ok(validateProductImage(file));
  }
});

test('network errors and expired sessions remain distinguishable', () => {
  assert.equal(getApiErrorStatus({ statusCode: 401 }), 401);
  assert.equal(getApiErrorStatus({ status: 503 }), 503);
  assert.equal(getApiErrorStatus(new Error('offline')), undefined);
  for (const error of [null, 'error', {}, { data: null }, { data: { statusMessage: 42 } }]) {
    assert.equal(getApiErrorMessage(error, 'Повторите попытку'), 'Повторите попытку');
  }
  assert.equal(
    getApiErrorMessage({ data: { statusMessage: 'Повторите через 15 минут' } }, 'fallback'),
    'Повторите через 15 минут',
  );
});
