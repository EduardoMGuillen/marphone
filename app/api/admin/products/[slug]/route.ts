import { NextResponse } from "next/server";
import { deleteProduct, updateProduct } from "@/lib/product-store";
import { parseProductInput } from "@/lib/product-parse";
import { revalidateCatalog } from "@/lib/catalog-revalidate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

export async function PUT(request: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const product = parseProductInput(body, slug);
    const updated = await updateProduct(slug, product);
    revalidateCatalog(slug, updated.product?.slug);
    return NextResponse.json(updated, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al actualizar";
    const status = message.includes("no encontrado")
      ? 404
      : message.includes("existe")
        ? 409
        : message.includes("Blob") || message.includes("BLOB_")
          ? 503
          : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  try {
    const result = await deleteProduct(slug);
    revalidateCatalog(slug);
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al eliminar";
    const status = message.includes("no encontrado")
      ? 404
      : message.includes("Blob") || message.includes("BLOB_")
        ? 503
        : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
