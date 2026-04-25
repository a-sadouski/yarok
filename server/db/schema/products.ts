import { pgTable, bigint, text, boolean, numeric, timestamp, integer } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
});

export const products = pgTable('products', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  categoryId: bigint('category_id', { mode: 'number' }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  isVariable: boolean('is_variable').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const colors = pgTable('colors', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  hex: text('hex'),
});

export const productVariants = pgTable('product_variants', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  productId: bigint('product_id', { mode: 'number' }).notNull(),
  colorId: bigint('color_id', { mode: 'number' }),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  oldPrice: numeric('old_price', { precision: 10, scale: 2 }),
  sku: text('sku'),
  inStock: boolean('in_stock').notNull().default(true),
  isActive: boolean('is_active').notNull().default(true),
});

export const productImages = pgTable('product_images', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  productId: bigint('product_id', { mode: 'number' }).notNull(),
  imagePath: text('image_path').notNull(),
  sortOrder: integer('sort_order').default(0),
});
