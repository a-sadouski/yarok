export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type ProductVariant = {
  id: number;
  productId: number;
  colorId: number | null;
  price: string | number;
  oldPrice: string | number | null;
  sku: string | null;
  inStock: boolean;
  isActive: boolean;
};

export interface ProductItem {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  description: string | null;
  imagePath: string | null;
  previewImage: string | null;
  isActive: boolean;
  isVariable: boolean;
  createdAt: string;
  variants: ProductVariant[];
}

export interface ProductVariantFormState {
  colorId: number | null;
  price: string;
  sku: string;
  inStock: boolean;
}

export type ProductVariantFormItem = {
  colorId: number | null;
  price: string;
  oldPrice: string;
  sku: string;
  inStock: boolean;
  isActive?: boolean;
};

export interface ProductFormState {
  name: string;
  categoryId: number | null;
  description: string;
  isVariable: boolean;
  isActive: boolean;
  previewImage: string;
  price: string;
  sku: string;
  inStock: boolean;
  variants: ProductVariantFormState[];
}

export interface CategoryOption {
  label: string;
  value: number;
}

export interface ColorOption {
  label: string;
  value: number;
}

export interface ProductPreviewCardModel {
  categoryLabel: string;
  title: string;
  image: string;
  price: string;
  isActive: boolean;
}

export interface ProductColor {
  id: number;
  name: string;
  slug: string;
  hex: string;
}

export type ProductCategory = {
  id: number;
  name: string;
  slug: string;
};

export interface CatalogProductColorOption {
  variationId: number;
  colorId: number;
  colorName: string;
  colorHex: string;
  price: number;
}

export interface CatalogProductMeta {
  colorOptions: CatalogProductColorOption[];
  defaultVariationId: number | null;
}

export type CatalogProductMetaById = Record<number, CatalogProductMeta>;
