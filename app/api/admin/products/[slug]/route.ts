import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteProduct, updateProduct } from "@/lib/product-store";
import { parseProductInput } from "@/lib/product-parse";

type Ctx = { params: Promise<{ slug: string }> };

function revalidateStorefront(slug: string, nextSlug?: string) {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/productos/${slug}`);
  if (nextSlug && nextSlug !== slug) {
    revalidatePath(`/productos/${nextSlug}`);
  }
}

export async function PUT(request: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const product = parseProductInput(body, slug);
    const updated = await updateProduct(slug, product);
    revalidateStorefront(slug, updated.slug);
    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al actualizar";
    const status = message.includes("no encontrado")
      ? 404
      : message.includes("existe")
        ? 409
        : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  try {
    await deleteProduct(slug);
    revalidateStorefront(slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al eliminar";
    const status = message.includes("no encontrado") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
