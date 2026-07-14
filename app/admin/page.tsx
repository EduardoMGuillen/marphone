import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import ProductTable from "@/components/admin/ProductTable";
import { getProducts } from "@/lib/product-store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const products = await getProducts();

  return (
    <AdminShell title="Catálogo">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {products.length} producto{products.length === 1 ? "" : "s"} en el
          catálogo
        </p>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
        >
          Agregar producto
        </Link>
      </div>
      <ProductTable products={products} />
    </AdminShell>
  );
}
