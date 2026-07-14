import { get, put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import type { Category, Product } from "@/lib/products";
import { ALL_CATEGORIES } from "@/lib/products";
import { normalizeColors } from "@/lib/color-utils";
import { seedProducts } from "@/lib/seed-products";
import { unstable_noStore as noStore } from "next/cache";

export { slugify } from "@/lib/slugify";

const PRODUCTS_BLOB_PATH = "catalog/products.json";
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "products.json");

type RawProduct = Partial<Product> & {
  brand: string;
  name: string;
  slug: string;
  colors?: unknown;
};

/** Serializa escrituras en la misma instancia (evita sobrescrituras en clics rápidos). */
let writeChain: Promise<void> = Promise.resolve();

function useBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

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

function normalizeList(raw: unknown): Product[] {
  if (!Array.isArray(raw)) return seedProducts.map(normalizeProduct);
  return (raw as RawProduct[]).map(normalizeProduct);
}

async function readLocalFile(): Promise<Product[] | null> {
  try {
    const text = await fs.readFile(DATA_FILE, "utf8");
    return normalizeList(JSON.parse(text));
  } catch {
    return null;
  }
}

async function writeLocalFile(products: Product[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), "utf8");
}

async function readBlobCatalog(): Promise<Product[] | null> {
  try {
    const result = await get(PRODUCTS_BLOB_PATH, {
      access: "public",
      useCache: false,
    });
    if (!result?.stream) return null;
    const text = await new Response(result.stream).text();
    return normalizeList(JSON.parse(text));
  } catch {
    return null;
  }
}

async function writeBlobCatalog(products: Product[]) {
  await put(PRODUCTS_BLOB_PATH, JSON.stringify(products, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
}

async function loadProducts(): Promise<Product[]> {
  if (useBlobStorage()) {
    const fromBlob = await readBlobCatalog();
    if (fromBlob) return fromBlob;

    // Primera vez en Vercel: inicializa Blob con el seed / archivo local del repo
    const fromLocal = (await readLocalFile()) ?? seedProducts.map(normalizeProduct);
    await writeBlobCatalog(fromLocal);
    return fromLocal;
  }

  const fromLocal = await readLocalFile();
  if (fromLocal) return fromLocal;

  const seeded = seedProducts.map(normalizeProduct);
  await writeLocalFile(seeded);
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
    if (useBlobStorage()) {
      await writeBlobCatalog(products);
      return;
    }
    if (process.env.VERCEL) {
      throw new Error(
        "Falta BLOB_READ_WRITE_TOKEN. Crea un Blob Store en Vercel (Storage → Blob) y vuelve a desplegar.",
      );
    }
    await writeLocalFile(products);
  };

  writeChain = writeChain.then(run, run);
  await writeChain;
}

export async function createProduct(product: Product) {
  const products = await getProducts();
  if (products.some((p) => p.slug === product.slug)) {
    throw new Error("Ya existe un producto con ese slug");
  }
  products.push(product);
  await saveProducts(products);
  return product;
}

export async function updateProduct(slug: string, data: Product) {
  const products = await getProducts();
  const index = products.findIndex((p) => p.slug === slug);
  if (index === -1) throw new Error("Producto no encontrado");

  if (data.slug !== slug && products.some((p) => p.slug === data.slug)) {
    throw new Error("Ya existe un producto con ese slug");
  }

  products[index] = data;
  await saveProducts(products);
  return data;
}

export async function deleteProduct(slug: string) {
  const products = await getProducts();
  const next = products.filter((p) => p.slug !== slug);
  if (next.length === products.length) throw new Error("Producto no encontrado");
  await saveProducts(next);
}

export function isBlobConfigured() {
  return useBlobStorage();
}
