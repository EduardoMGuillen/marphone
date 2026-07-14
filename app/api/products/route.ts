import { NextResponse } from "next/server";
import { getProducts } from "@/lib/product-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Índice ligero para el buscador del header (público). */
export async function GET() {
  const products = await getProducts();
  const index = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: p.category,
    series: p.series,
    tagline: p.tagline,
    image: p.image,
    soldOut: Boolean(p.soldOut),
  }));

  return NextResponse.json(index, {
    headers: {
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
    },
  });
}
