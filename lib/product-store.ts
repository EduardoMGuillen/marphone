import { promises as fs } from "fs";
import path from "path";
import type { Category, Product } from "@/lib/products";
import { ALL_CATEGORIES } from "@/lib/products";
import { normalizeColors } from "@/lib/color-utils";
import { seedProducts } from "@/lib/seed-products";

export { slugify } from "@/lib/slugify";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "products.json");

type RawProduct = Partial<Product> & {
  brand: string;
  name: string;
  slug: string;
  colors?: unknown;
};

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

function needsMigration(raw: RawProduct) {
  if (!raw.category) return true;
  if (typeof raw.soldOut === "undefined") return true;
  if (!Array.isArray(raw.colors)) return true;
  return raw.colors.some((c) => typeof c === "string");
}

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(seedProducts, null, 2), "utf8");
  }
}

export async function getProducts(): Promise<Product[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  const parsed = JSON.parse(raw) as RawProduct[];
  const products = parsed.map(normalizeProduct);

  if (parsed.some(needsMigration)) {
    await saveProducts(products);
  }

  return products;
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

export function getBrandsFrom(products: Product[], category?: Category | "Todos"): string[] {
  const scoped =
    !category || category === "Todos"
      ? products
      : products.filter((p) => p.category === category);
  return Array.from(new Set(scoped.map((p) => p.brand))).sort((a, b) =>
    a.localeCompare(b, "es"),
  );
}

export async function saveProducts(products: Product[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), "utf8");
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
