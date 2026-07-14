"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import type { Category, Product, ProductColor } from "@/lib/products";
import { ALL_CATEGORIES, SUGGESTED_BRANDS } from "@/lib/products";
import { slugify } from "@/lib/slugify";

type Props = {
  mode: "create" | "edit";
  initial?: Product;
};

type ColorRow = ProductColor & { id: string };

function toRows(colors: ProductColor[] | undefined): ColorRow[] {
  return (colors ?? []).map((c, i) => ({
    id: `${c.name}-${i}`,
    name: c.name,
    soldOut: Boolean(c.soldOut),
  }));
}

export default function ProductForm({ mode, initial }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [category, setCategory] = useState<Category>(
    initial?.category ?? "Teléfonos",
  );
  const [brand, setBrand] = useState(initial?.brand ?? "");
  const [series, setSeries] = useState(initial?.series ?? "");
  const [tagline, setTagline] = useState(initial?.tagline ?? "");
  const [priceLabel, setPriceLabel] = useState(initial?.priceLabel ?? "Consultar");
  const [storage, setStorage] = useState(initial?.storage.join(", ") ?? "");
  const [colorRows, setColorRows] = useState<ColorRow[]>(() =>
    toRows(initial?.colors),
  );
  const [newColor, setNewColor] = useState("");
  const [specs, setSpecs] = useState(initial?.specs.join(", ") ?? "");
  const [featured, setFeatured] = useState(Boolean(initial?.featured));
  const [soldOut, setSoldOut] = useState(Boolean(initial?.soldOut));
  const [image, setImage] = useState(initial?.image ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const preview = useMemo(() => image || "/brand/pet.png", [image]);
  const brandSuggestions = useMemo(() => {
    const set = new Set(SUGGESTED_BRANDS);
    if (initial?.brand) set.add(initial.brand);
    return Array.from(set);
  }, [initial?.brand]);

  function onNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function addColor() {
    const nameValue = newColor.trim();
    if (!nameValue) return;
    if (colorRows.some((c) => c.name.toLowerCase() === nameValue.toLowerCase())) {
      setError("Ese color ya está en la lista");
      return;
    }
    setError("");
    setColorRows((rows) => [
      ...rows,
      { id: `${nameValue}-${Date.now()}`, name: nameValue, soldOut: false },
    ]);
    setNewColor("");
  }

  function updateColor(id: string, patch: Partial<ProductColor>) {
    setColorRows((rows) =>
      rows.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  }

  function removeColor(id: string) {
    setColorRows((rows) => rows.filter((row) => row.id !== id));
  }

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al subir");
      setImage(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir imagen");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const colors = colorRows
      .map(({ name: colorName, soldOut: colorSoldOut }) => ({
        name: colorName.trim(),
        soldOut: Boolean(colorSoldOut),
      }))
      .filter((c) => c.name);

    const payload = {
      name,
      slug,
      category,
      brand,
      series,
      tagline,
      priceLabel,
      storage,
      colors,
      specs,
      featured,
      soldOut,
      image,
    };

    try {
      const res = await fetch(
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${initial!.slug}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  const field =
    "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-blue";

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <div className="space-y-5 rounded-3xl bg-white p-6 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.35)] md:p-8">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-1.5 md:col-span-2">
            <span className="text-xs font-semibold tracking-wide text-muted uppercase">
              Nombre
            </span>
            <input
              className={field}
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              required
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold tracking-wide text-muted uppercase">
              Categoría
            </span>
            <select
              className={field}
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              required
            >
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold tracking-wide text-muted uppercase">
              Marca
            </span>
            <input
              className={field}
              list="brand-suggestions"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Apple, Anker, JBL…"
              required
            />
            <datalist id="brand-suggestions">
              {brandSuggestions.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold tracking-wide text-muted uppercase">
              Slug (URL)
            </span>
            <input
              className={field}
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              required
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold tracking-wide text-muted uppercase">
              Serie / línea
            </span>
            <input
              className={field}
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              placeholder="iPhone 17, AirPods, MagSafe…"
              required
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold tracking-wide text-muted uppercase">
              Precio (etiqueta)
            </span>
            <input
              className={field}
              value={priceLabel}
              onChange={(e) => setPriceLabel(e.target.value)}
              required
            />
          </label>
          <label className="block space-y-1.5 md:col-span-2">
            <span className="text-xs font-semibold tracking-wide text-muted uppercase">
              Descripción corta
            </span>
            <textarea
              className={`${field} min-h-24 resize-y`}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              required
            />
          </label>
          <label className="block space-y-1.5 md:col-span-2">
            <span className="text-xs font-semibold tracking-wide text-muted uppercase">
              Variantes / capacidad (separado por comas)
            </span>
            <input
              className={field}
              value={storage}
              onChange={(e) => setStorage(e.target.value)}
              placeholder="128 GB, 256 GB — o deja vacío"
            />
          </label>

          <div className="space-y-3 md:col-span-2">
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">
              Colores
            </p>
            {colorRows.length === 0 ? (
              <p className="text-sm text-muted">Sin colores. Agrega al menos uno si aplica.</p>
            ) : (
              <ul className="space-y-2">
                {colorRows.map((row) => (
                  <li
                    key={row.id}
                    className="flex flex-wrap items-center gap-2 rounded-xl border border-black/8 bg-surface/60 px-3 py-2"
                  >
                    <input
                      className={`${field} min-w-[140px] flex-1`}
                      value={row.name}
                      onChange={(e) => updateColor(row.id, { name: e.target.value })}
                      aria-label="Nombre del color"
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={Boolean(row.soldOut)}
                        onChange={(e) =>
                          updateColor(row.id, { soldOut: e.target.checked })
                        }
                        className="size-4 accent-brand-blue"
                      />
                      Sold out
                    </label>
                    <button
                      type="button"
                      onClick={() => removeColor(row.id)}
                      className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-2">
              <input
                className={`${field} min-w-[180px] flex-1`}
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Ej. Negro Titanio"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addColor();
                  }
                }}
              />
              <button
                type="button"
                onClick={addColor}
                className="rounded-full border border-black/10 px-4 py-2.5 text-sm font-semibold transition hover:border-brand-blue hover:text-brand-blue"
              >
                Agregar color
              </button>
            </div>
          </div>

          <label className="block space-y-1.5 md:col-span-2">
            <span className="text-xs font-semibold tracking-wide text-muted uppercase">
              Specs / detalles (separado por comas)
            </span>
            <input
              className={field}
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
            />
          </label>
          <label className="flex items-center gap-3 md:col-span-2">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="size-4 accent-brand-blue"
            />
            <span className="text-sm font-medium">Mostrar en destacados</span>
          </label>
          <label className="flex items-center gap-3 md:col-span-2 rounded-xl border border-red-100 bg-red-50/50 px-4 py-3">
            <input
              type="checkbox"
              checked={soldOut}
              onChange={(e) => setSoldOut(e.target.checked)}
              className="size-4 accent-red-600"
            />
            <span className="text-sm font-medium">
              Producto agotado (sold out total)
            </span>
          </label>
        </div>

        {error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-full bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-blue-dark disabled:opacity-60"
          >
            {saving ? "Guardando…" : mode === "create" ? "Agregar producto" : "Guardar cambios"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="rounded-full border border-black/10 px-6 py-2.5 text-sm font-semibold transition hover:border-black/25"
          >
            Cancelar
          </button>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-3xl bg-white p-5 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.35)]">
          <p className="mb-3 text-xs font-semibold tracking-wide text-muted uppercase">
            Imagen del producto
          </p>
          <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-surface">
            <Image
              src={preview}
              alt={name || "Vista previa"}
              fill
              className="object-contain p-4"
              sizes="280px"
            />
          </div>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold tracking-wide text-muted uppercase">
              URL o ruta
            </span>
            <input
              className={field}
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/products/mi-producto.jpg"
              required
            />
          </label>
          <label className="mt-3 flex cursor-pointer items-center justify-center rounded-full border border-dashed border-black/15 px-4 py-3 text-sm font-semibold transition hover:border-brand-blue hover:text-brand-blue">
            {uploading ? "Subiendo…" : "Subir imagen"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
      </aside>
    </form>
  );
}
