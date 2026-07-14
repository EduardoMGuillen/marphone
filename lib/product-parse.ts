import type { Category, Product } from "@/lib/products";
import { ALL_CATEGORIES } from "@/lib/products";
import { normalizeColors } from "@/lib/color-utils";
import { slugify } from "@/lib/slugify";

function isCategory(value: string): value is Category {
  return (ALL_CATEGORIES as string[]).includes(value);
}

function parseList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).map((s) => s.trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export function parseProductInput(
  body: Record<string, unknown>,
  fallbackSlug?: string,
): Product {
  const name = String(body.name ?? "").trim();
  const category = String(body.category ?? "").trim();
  const brand = String(body.brand ?? "").trim();
  const series = String(body.series ?? "").trim();
  const tagline = String(body.tagline ?? "").trim();
  const priceLabel = String(body.priceLabel ?? "Consultar").trim() || "Consultar";
  const image = String(body.image ?? "").trim();
  const slug =
    String(body.slug ?? "").trim() ||
    fallbackSlug ||
    slugify(name);

  if (!name || !category || !brand || !series || !tagline || !image || !slug) {
    throw new Error("Faltan campos obligatorios");
  }
  if (!isCategory(category)) {
    throw new Error("Categoría no válida");
  }

  return {
    slug,
    name,
    category,
    brand,
    series,
    tagline,
    priceLabel,
    storage: parseList(body.storage),
    colors: normalizeColors(body.colors),
    specs: parseList(body.specs),
    featured: Boolean(body.featured),
    soldOut: Boolean(body.soldOut),
    image,
  };
}
