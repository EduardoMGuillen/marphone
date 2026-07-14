import type { ProductColor } from "@/lib/products";

/** Acepta string[], ProductColor[] o lista CSV */
export function normalizeColors(value: unknown): ProductColor[] {
  if (!Array.isArray(value)) {
    if (typeof value === "string") {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((name) => ({ name, soldOut: false }));
    }
    return [];
  }

  const colors: ProductColor[] = [];
  for (const item of value) {
    if (typeof item === "string") {
      const name = item.trim();
      if (name) colors.push({ name, soldOut: false });
      continue;
    }
    if (item && typeof item === "object") {
      const record = item as Record<string, unknown>;
      const name = String(record.name ?? "").trim();
      if (name) colors.push({ name, soldOut: Boolean(record.soldOut) });
    }
  }
  return colors;
}
