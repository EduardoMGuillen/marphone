import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import ProductTable from "@/components/admin/ProductTable";
import { getProducts, isBlobConfigured } from "@/lib/product-store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const products = await getProducts();
  const blobOk = isBlobConfigured();
  const onVercel = Boolean(process.env.VERCEL);

  return (
    <AdminShell title="Catálogo">
      {onVercel && !blobOk ? (
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Falta configurar <strong>Vercel Blob</strong> (
          <code className="text-xs">BLOB_READ_WRITE_TOKEN</code> o{" "}
          <code className="text-xs">BLOB_STORE_ID</code>). Sin eso, crear /
          editar / subir imágenes no persistirá en producción. Crea un store{" "}
          <strong>Public</strong> en Storage → Blob y redespliega.
        </p>
      ) : null}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {products.length} producto{products.length === 1 ? "" : "s"} en el
          catálogo
          {blobOk ? " · almacenamiento durable (Blob)" : " · almacenamiento local"}
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
