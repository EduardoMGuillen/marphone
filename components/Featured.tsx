"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";
import { isProductSoldOut } from "@/lib/products";
import { whatsappInterestUrl } from "@/lib/contact";

type Props = {
  products: Product[];
};

export default function Featured({ products }: Props) {
  return (
    <section id="destacados" className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 max-w-2xl"
        >
          <p className="mb-3 text-sm font-semibold tracking-wide text-brand-blue uppercase">
            Destacados
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
            La nueva generación.
          </h2>
          <p className="mt-4 text-muted md:text-lg">
            Lo más pedido del catálogo. Consulta disponibilidad por WhatsApp.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product, i) => (
            <motion.article
              key={product.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group flex flex-col overflow-hidden rounded-3xl bg-surface"
            >
              <Link href={`/productos/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  quality={90}
                  unoptimized={product.image.startsWith("http")}
                  className={`object-contain p-8 transition duration-700 group-hover:scale-105 ${
                    isProductSoldOut(product) ? "opacity-60" : ""
                  }`}
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                {isProductSoldOut(product) ? (
                  <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white">
                    Agotado
                  </span>
                ) : null}
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-semibold">{product.name}</h3>
                <p className="mt-2 flex-1 text-sm text-muted">{product.tagline}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {isProductSoldOut(product) ? null : (
                    <a
                      href={whatsappInterestUrl(product.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-blue"
                    >
                      Consultar este modelo
                    </a>
                  )}
                  <Link
                    href={`/productos/${product.slug}`}
                    className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold transition hover:border-black/30"
                  >
                    Ver detalle
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
