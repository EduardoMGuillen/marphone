import { revalidatePath } from "next/cache";

/** Invalida tienda + admin para que los cambios se vean al instante. */
export function revalidateCatalog(slug?: string, nextSlug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin", "layout");
  if (slug) {
    revalidatePath(`/productos/${slug}`);
    revalidatePath(`/admin/products/${slug}`);
  }
  if (nextSlug && nextSlug !== slug) {
    revalidatePath(`/productos/${nextSlug}`);
    revalidatePath(`/admin/products/${nextSlug}`);
  }
}
