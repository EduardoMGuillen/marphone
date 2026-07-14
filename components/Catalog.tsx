"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import type { Category, Product } from "@/lib/products";

type Props = {
  products: Product[];
};

export default function Catalog({ products }: Props) {
  const [category, setCategory] = useState<"Todos" | Category>("Todos");
  const [brand, setBrand] = useState<"Todas" | string>("Todas");

  const categories = useMemo(() => {
    const present = new Set(products.map((p) => p.category));
    const order: Category[] = [
      "Teléfonos",
      "Tablets",
      "Audífonos",
      "Wearables",
      "Accesorios",
      "Otros",
    ];
    return order.filter((c) => present.has(c));
  }, [products]);

  const brands = useMemo(() => {
    const scoped =
      category === "Todos"
        ? products
        : products.filter((p) => p.category === category);
    return Array.from(new Set(scoped.map((p) => p.brand))).sort((a, b) =>
      a.localeCompare(b, "es"),
    );
  }, [products, category]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category !== "Todos" && p.category !== category) return false;
      if (brand !== "Todas" && p.brand !== brand) return false;
      return true;
    });
  }, [products, category, brand]);

  function selectCategory(next: "Todos" | Category) {
    setCategory(next);
    setBrand("Todas");
  }

  const categoryFilters: Array<"Todos" | Category> = ["Todos", ...categories];
  const brandFilters: Array<"Todas" | string> = ["Todas", ...brands];

  return (
    <section id="catalogo" className="bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 max-w-2xl"
        >
          <p className="mb-3 text-sm font-semibold tracking-wide text-brand-blue uppercase">
            Catálogo
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
            Teléfonos, accesorios y más.
          </h2>
          <p className="mt-4 text-muted md:text-lg">
            Filtra por categoría y marca. Precios y stock se confirman por
            WhatsApp o Instagram.
          </p>
        </motion.div>

        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">
            Categoría
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categoryFilters.map((f) => {
              const active = category === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => selectCategory(f)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-black text-white"
                      : "bg-white text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-10">
          <p className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">
            Marca
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {brandFilters.map((f) => {
              const active = brand === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setBrand(f)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-brand-blue text-white"
                      : "bg-white text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-2xl bg-white px-5 py-10 text-center text-sm text-muted">
            No hay productos con ese filtro.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
