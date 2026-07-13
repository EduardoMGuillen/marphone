"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { brands, type Brand, type Product } from "@/lib/products";

type Props = {
  products: Product[];
};

export default function Catalog({ products }: Props) {
  const [brand, setBrand] = useState<"Todos" | Brand>("Todos");

  const filtered = useMemo(() => {
    if (brand === "Todos") return products;
    return products.filter((p) => p.brand === brand);
  }, [brand, products]);

  const filters: Array<"Todos" | Brand> = ["Todos", ...brands];

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
            Encuentra tu próximo teléfono.
          </h2>
          <p className="mt-4 text-muted md:text-lg">
            Precios y stock se confirman por WhatsApp o Instagram. Sin compras
            online: te asesoramos directo.
          </p>
        </motion.div>

        <div className="mb-10 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((f) => {
            const active = brand === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setBrand(f)}
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

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
