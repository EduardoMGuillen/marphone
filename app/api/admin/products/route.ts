import { NextResponse } from "next/server";
import { createProduct, getProducts } from "@/lib/product-store";
import { parseProductInput } from "@/lib/product-parse";
import { revalidateCatalog } from "@/lib/catalog-revalidate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const product = parseProductInput(body);
    const created = await createProduct(product);
    revalidateCatalog(created.slug);
    return NextResponse.json(created, {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al crear";
    const status = message.includes("existe")
      ? 409
      : message.includes("BLOB_READ_WRITE_TOKEN")
        ? 503
        : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
