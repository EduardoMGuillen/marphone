"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Category, Product } from "@/lib/products";
import { ALL_CATEGORIES, isProductSoldOut } from "@/lib/products";

type Props = {
  products: Product[];
};

export default function ProductTable({ products: initial }: Props) {
  const [products, setProducts] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [category, setCategory] = useState<"Todas" | Category>("Todas");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setProducts(initial);
  }, [initial]);

  const categories = useMemo(() => {
    const present = new Set(products.map((p) => p.category));
    return ALL_CATEGORIES.filter((c) => present.has(c));
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "Todas" && p.category !== category) return false;
      if (!q) return true;
      const haystack = [
        p.name,
        p.brand,
        p.series,
        p.slug,
        p.tagline,
        p.category,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [products, category, query]);

  async function remove(slug: string, name: string) {
    if (busy) return;
    if (!confirm(`¿Eliminar "${name}" del catálogo?`)) return;
    setBusy(slug);
    setError("");
    try {
      const res = await fetch(`/api/admin/products/${slug}`, {
        method: "DELETE",
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo eliminar");
      if (Array.isArray(data.products)) {
        setProducts(data.products as Product[]);
      } else {
        setProducts((prev) => prev.filter((p) => p.slug !== slug));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setBusy(null);
    }
  }

  if (products.length === 0) {
    return (
      <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-[0_20px_50px_-40px_rgba(0,0,0,0.35)]">
        <p className="font-display text-xl font-semibold">Sin productos</p>
        <p className="mt-2 text-sm text-muted">
          Agrega el primero al catálogo. Un catálogo vacío es válido y no se
          re-siembra solo.
        </p>
        <Link
          href="/admin/products/new"
          className="mt-6 inline-flex rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white"
        >
          Agregar producto
        </Link>
      </div>
    );
  }

  const categoryFilters: Array<"Todas" | Category> = ["Todas", ...categories];

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-4 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.35)] md:p-5">
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold tracking-wide text-muted uppercase">
            Buscar
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nombre, marca, serie, slug…"
            className="w-full rounded-xl border border-black/10 bg-surface/50 px-4 py-2.5 text-sm outline-none transition focus:border-brand-blue"
          />
        </label>

        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">
            Categoría
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categoryFilters.map((f) => {
              const active = category === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setCategory(f)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-black text-white"
                      : "bg-surface text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-3 text-xs text-muted">
          Mostrando {filtered.length} de {products.length} producto
          {products.length === 1 ? "" : "s"}
          {query.trim() || category !== "Todas" ? " (filtrado)" : ""}. Espera a
          que termine el loading antes de la siguiente acción.
        </p>
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-white px-6 py-12 text-center shadow-[0_20px_50px_-40px_rgba(0,0,0,0.35)]">
          <p className="font-display text-lg font-semibold">Sin resultados</p>
          <p className="mt-2 text-sm text-muted">
            Prueba otra categoría o limpia la búsqueda.
          </p>
          <button
            type="button"
            onClick={() => {
              setCategory("Todas");
              setQuery("");
            }}
            className="mt-5 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold transition hover:border-brand-blue hover:text-brand-blue"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_-40px_rgba(0,0,0,0.35)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-black/5 bg-surface/80 text-xs tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-5 py-4 font-semibold">Producto</th>
                  <th className="px-5 py-4 font-semibold">Categoría</th>
                  <th className="px-5 py-4 font-semibold">Marca</th>
                  <th className="px-5 py-4 font-semibold">Precio</th>
                  <th className="px-5 py-4 font-semibold">Estado</th>
                  <th className="px-5 py-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr
                    key={product.slug}
                    className="border-b border-black/5 last:border-0"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-surface">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            unoptimized={product.image.startsWith("http")}
                            className="object-contain p-1.5"
                            sizes="56px"
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-xs text-muted">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">{product.category}</td>
                    <td className="px-5 py-4">{product.brand}</td>
                    <td className="px-5 py-4 text-brand-blue font-medium">
                      {product.priceLabel}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1.5">
                        {isProductSoldOut(product) ? (
                          <span className="w-fit rounded-full bg-black px-2.5 py-1 text-xs font-semibold text-white">
                            Agotado
                          </span>
                        ) : product.colors.some((c) => c.soldOut) ? (
                          <span className="w-fit rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                            Stock parcial
                          </span>
                        ) : (
                          <span className="w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            Disponible
                          </span>
                        )}
                        {product.featured ? (
                          <span className="w-fit rounded-full bg-brand-blue/10 px-2.5 py-1 text-xs font-semibold text-brand-blue">
                            Destacado
                          </span>
                        ) : null}
                        {product.colors.length > 0 ? (
                          <span className="text-xs text-muted">
                            {product.colors.filter((c) => !c.soldOut).length}/
                            {product.colors.length} colores
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.slug}`}
                          className={`rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold transition hover:border-brand-blue hover:text-brand-blue ${
                            busy ? "pointer-events-none opacity-60" : ""
                          }`}
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          disabled={Boolean(busy)}
                          onClick={() => remove(product.slug, product.name)}
                          className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                        >
                          {busy === product.slug ? "…" : "Quitar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
