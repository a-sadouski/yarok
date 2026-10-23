import assert from 'node:assert/strict';
import test from 'node:test';
import { createProductPayload } from '../app/utils/product-payload';
import type { ProductFormState, ProductVariant } from '../app/types/product';

const form: ProductFormState = {
  name: ' Товар ',
  categoryId: 1,
  description: '',
  isVariable: false,
  isActive: true,
  previewImage: '',
  price: '0',
  sku: '',
  inStock: false,
  variants: [],
};
const original: ProductVariant = {
  id: 1,
  productId: 1,
  colorId: 7,
  price: '10',
  oldPrice: '20.00',
  sku: '',
  inStock: false,
  isActive: false,
};

test('simple product forces gray color, zero price, old price and visibility', () => {
  const body = createProductPayload(form, null, false, [original], 7);
  assert.equal(body.get('colorId'), '7');
  assert.equal(body.get('price'), '0');
  assert.equal(body.get('inStock'), 'false');
  assert.equal(body.get('variantActive'), 'false');
  assert.equal(body.get('oldPrice'), '20.00');
  assert.equal(body.get('name'), 'Товар');
  assert.equal(body.get('removeImage'), 'false');
});

test('variant edit keeps inactive flags and old prices by color', () => {
  const body = createProductPayload(
    {
      ...form,
      isVariable: true,
      variants: [
        { colorId: 7, price: '15', sku: '', inStock: true },
        { colorId: 8, price: '0', sku: '', inStock: false },
      ],
    },
    null,
    false,
    [original],
    7,
  );
  assert.deepEqual(JSON.parse(String(body.get('variants'))), [
    { colorId: 7, price: '15', sku: '', inStock: true, oldPrice: '20.00', isActive: false },
    { colorId: 8, price: '0', sku: '', inStock: false, oldPrice: null, isActive: true },
  ]);
});

test('image removal and upload have explicit payloads', () => {
  const removed = createProductPayload(form, null, true, [], 7);
  assert.equal(removed.get('removeImage'), 'true');
  assert.equal(removed.has('image'), false);
  const file = new File(['test'], 'test.png', { type: 'image/png' });
  const uploaded = createProductPayload(form, file, false, [], 7);
  assert.equal(uploaded.get('image'), file);
  assert.equal(uploaded.get('removeImage'), 'false');
});
