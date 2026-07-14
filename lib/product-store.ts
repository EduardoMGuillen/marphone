import { unstable_noStore as noStore } from "next/cache";
import type { Category, Product } from "@/lib/products";
import { ALL_CATEGORIES } from "@/lib/products";
import { normalizeColors } from "@/lib/color-utils";
import { seedProducts } from "@/lib/seed-products";
import {
  blobMissingMessage,
  isBlobConfigured,
  readBlobCatalog,
  readLocalCatalog,
  writeBlobCatalog,
  writeLocalCatalog,
} from "@/lib/blob-store";

export { slugify } from "@/lib/slugify";
export { isBlobConfigured } from "@/lib/blob-store";

type RawProduct = Partial<Product> & {
  brand: string;
  name: string;
  slug: string;
  colors?: unknown;
};

/** Serializa mutaciones en la misma instancia. */
let writeChain: Promise<void> = Promise.resolve();

function normalizeProduct(raw: RawProduct): Product {
  const category =
    raw.category && (ALL_CATEGORIES as string[]).includes(raw.category)
      ? raw.category
      : ("Teléfonos" as Category);

  return {
    slug: raw.slug,
    name: raw.name,
    category,
    brand: String(raw.brand || "").trim() || "Sin marca",
    series: String(raw.series || "").trim() || raw.name,
    tagline: String(raw.tagline || "").trim() || raw.name,
    priceLabel: String(raw.priceLabel || "Consultar").trim() || "Consultar",
    storage: Array.isArray(raw.storage) ? raw.storage : [],
    colors: normalizeColors(raw.colors),
    specs: Array.isArray(raw.specs) ? raw.specs : [],
    featured: Boolean(raw.featured),
    soldOut: Boolean(raw.soldOut),
    image: String(raw.image || "").trim() || "/brand/pet.png",
  };
}

function normalizeList(raw: Product[] | null | undefined): Product[] {
  if (!raw) return [];
  return raw.map((p) => normalizeProduct(p as RawProduct));
}

function seedList() {
  return seedProducts.map((p) => normalizeProduct(p as RawProduct));
}

/**
 * Carga el catálogo.
 * - Blob: versiones en marphone/catalog/*; `[]` no se re-siembra.
 * - Primera vez (sin versiones): siembra desde data/products.json o seed.
 */
async function loadProducts(): Promise<Product[]> {
  if (isBlobConfigured()) {
    const fromBlob = await readBlobCatalog();
    if (fromBlob !== null) return normalizeList(fromBlob);

    const fromLocal = await readLocalCatalog();
    const seeded = normalizeList(fromLocal);
    const initial = seeded.length > 0 ? seeded : seedList();
    await writeBlobCatalog(initial);
    return initial;
  }

  const fromLocal = await readLocalCatalog();
  if (fromLocal) return normalizeList(fromLocal);

  const seeded = seedList();
  await writeLocalCatalog(seeded);
  return seeded;
}

export async function getProducts(): Promise<Product[]> {
  noStore();
  return loadProducts();
}

export async function getProduct(slug: string) {
  const products = await getProducts();
  return products.find((p) => p.slug === slug);
}

export async function getFeaturedProducts() {
  const products = await getProducts();
  return products.filter((p) => p.featured);
}

export function getCategoriesFrom(products: Product[]): Category[] {
  const present = new Set(products.map((p) => p.category));
  return ALL_CATEGORIES.filter((c) => present.has(c));
}

export function getBrandsFrom(
  products: Product[],
  category?: Category | "Todos",
): string[] {
  const scoped =
    !category || category === "Todos"
      ? products
      : products.filter((p) => p.category === category);
  return Array.from(new Set(scoped.map((p) => p.brand))).sort((a, b) =>
    a.localeCompare(b, "es"),
  );
}

export async function saveProducts(products: Product[]) {
  const run = async () => {
    if (isBlobConfigured()) {
      await writeBlobCatalog(products);
      return;
    }
    if (process.env.VERCEL) {
      throw new Error(blobMissingMessage());
    }
    await writeLocalCatalog(products);
  };

  writeChain = writeChain.then(run, run);
  await writeChain;
}

export type MutationResult = {
  product?: Product;
  products: Product[];
};

export async function createProduct(product: Product): Promise<MutationResult> {
  const products = await getProducts();
  if (products.some((p) => p.slug === product.slug)) {
    throw new Error("Ya existe un producto con ese slug");
  }
  const next = [...products, product];
  await saveProducts(next);
  return { product, products: next };
}

export async function updateProduct(
  slug: string,
  data: Product,
): Promise<MutationResult> {
  const products = await getProducts();
  const index = products.findIndex((p) => p.slug === slug);
  if (index === -1) throw new Error("Producto no encontrado");

  if (data.slug !== slug && products.some((p) => p.slug === data.slug)) {
    throw new Error("Ya existe un producto con ese slug");
  }

  const next = [...products];
  next[index] = data;
  await saveProducts(next);
  return { product: data, products: next };
}

export async function deleteProduct(slug: string): Promise<MutationResult> {
  const products = await getProducts();
  const next = products.filter((p) => p.slug !== slug);
  if (next.length === products.length) throw new Error("Producto no encontrado");
  await saveProducts(next);
  return { products: next };
}
