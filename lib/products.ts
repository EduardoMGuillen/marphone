export type Category =
  | "Teléfonos"
  | "Tablets"
  | "Consolas"
  | "Audífonos"
  | "Wearables"
  | "Accesorios"
  | "Otros";

export type ProductColor = {
  name: string;
  soldOut?: boolean;
};

export type Product = {
  slug: string;
  name: string;
  category: Category;
  brand: string;
  series: string;
  tagline: string;
  priceLabel: string;
  storage: string[];
  colors: ProductColor[];
  specs: string[];
  featured?: boolean;
  /** Todo el producto agotado */
  soldOut?: boolean;
  image: string;
};

export function isProductSoldOut(product: Product): boolean {
  if (product.soldOut) return true;
  if (product.colors.length === 0) return false;
  return product.colors.every((c) => c.soldOut);
}

export function availableColors(product: Product): ProductColor[] {
  return product.colors.filter((c) => !c.soldOut);
}

export { ALL_CATEGORIES, SUGGESTED_BRANDS } from "./seed-products";
