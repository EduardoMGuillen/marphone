import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createProduct, getProducts } from "@/lib/product-store";
import { parseProductInput } from "@/lib/product-parse";

function revalidateStorefront(slug?: string) {
  revalidatePath("/");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/productos/${slug}`);
}

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const product = parseProductInput(body);
    const created = await createProduct(product);
    revalidateStorefront(created.slug);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al crear";
    const status = message.includes("existe") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
